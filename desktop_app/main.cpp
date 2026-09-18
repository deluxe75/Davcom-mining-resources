#include <arpa/inet.h>
#include <netdb.h>
#include <sys/socket.h>
#include <unistd.h>

#include <cstdlib>
#include <cstring>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>

namespace {

struct ApiUrl {
    std::string host;
    std::string port;
    std::string path;
};

std::string jsonEscape(const std::string& value) {
    std::string escaped;
    for (const char character : value) {
        switch (character) {
            case '"': escaped += "\\\""; break;
            case '\\': escaped += "\\\\"; break;
            case '\n': escaped += "\\n"; break;
            case '\r': escaped += "\\r"; break;
            case '\t': escaped += "\\t"; break;
            default: escaped += character;
        }
    }
    return escaped;
}

ApiUrl parseApiUrl(const std::string& url) {
    const std::string prefix = "http://";
    if (url.rfind(prefix, 0) != 0) {
        throw std::runtime_error("DAVCOM_API_URL must begin with http://");
    }

    const std::string authorityAndPath = url.substr(prefix.size());
    const std::size_t pathStart = authorityAndPath.find('/');
    const std::string authority = authorityAndPath.substr(0, pathStart);
    const std::size_t portStart = authority.find(':');

    ApiUrl result;
    result.host = authority.substr(0, portStart);
    result.port = portStart == std::string::npos ? "80" : authority.substr(portStart + 1);
    result.path = pathStart == std::string::npos ? "/" : authorityAndPath.substr(pathStart);

    if (result.host.empty() || result.port.empty() || result.path.empty()) {
        throw std::runtime_error("DAVCOM_API_URL is incomplete");
    }
    return result;
}

std::string sendHttpRequest(const ApiUrl& url, const std::string& payload) {
    addrinfo hints{};
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    addrinfo* addressList = nullptr;

    const int lookupResult = getaddrinfo(url.host.c_str(), url.port.c_str(), &hints, &addressList);
    if (lookupResult != 0) {
        throw std::runtime_error("Could not resolve the API host: " + std::string(gai_strerror(lookupResult)));
    }

    int socketHandle = -1;
    for (addrinfo* address = addressList; address != nullptr; address = address->ai_next) {
        socketHandle = socket(address->ai_family, address->ai_socktype, address->ai_protocol);
        if (socketHandle < 0) {
            continue;
        }
        if (connect(socketHandle, address->ai_addr, address->ai_addrlen) == 0) {
            break;
        }
        close(socketHandle);
        socketHandle = -1;
    }
    freeaddrinfo(addressList);

    if (socketHandle < 0) {
        throw std::runtime_error("Could not connect to the company API at " + url.host + ":" + url.port);
    }

    const std::string request =
        "POST " + url.path + " HTTP/1.1\r\n"
        "Host: " + url.host + "\r\n"
        "Content-Type: application/json\r\n"
        "Accept: application/json\r\n"
        "Content-Length: " + std::to_string(payload.size()) + "\r\n"
        "Connection: close\r\n\r\n" + payload;

    std::size_t sent = 0;
    while (sent < request.size()) {
        const ssize_t count = send(socketHandle, request.data() + sent, request.size() - sent, 0);
        if (count <= 0) {
            close(socketHandle);
            throw std::runtime_error("The request could not be sent");
        }
        sent += static_cast<std::size_t>(count);
    }

    std::string response;
    char buffer[4096];
    ssize_t received = 0;
    while ((received = recv(socketHandle, buffer, sizeof(buffer), 0)) > 0) {
        response.append(buffer, static_cast<std::size_t>(received));
    }
    close(socketHandle);

    if (response.empty()) {
        throw std::runtime_error("The company API returned an empty response");
    }
    return response;
}

std::string prompt(const std::string& label, bool required = false) {
    std::cout << label << (required ? " *" : "") << ": ";
    std::string value;
    std::getline(std::cin, value);
    return value;
}

bool looksLikeEmail(const std::string& email) {
    const std::size_t at = email.find('@');
    return at != std::string::npos && at > 0 && email.find('.', at) != std::string::npos;
}

int responseStatus(const std::string& response) {
    std::istringstream firstLine(response.substr(0, response.find("\r\n")));
    std::string protocol;
    int status = 0;
    firstLine >> protocol >> status;
    return status;
}

}  // namespace

int main() {
    std::cout << "\nDAVCOM MINING RESOURCES\n"
              << "Corporate message desk\n"
              << "=======================\n"
              << "Messages are sent through the company website API.\n\n";

    const std::string name = prompt("Full name", true);
    const std::string email = prompt("Email address", true);
    const std::string phone = prompt("Phone number");
    const std::string company = prompt("Company / organization");
    const std::string subject = prompt("Subject", true);
    const std::string message = prompt("Message", true);

    if (name.empty() || email.empty() || subject.empty() || message.empty()) {
        std::cerr << "\nPlease complete all required fields.\n";
        return 1;
    }
    if (!looksLikeEmail(email)) {
        std::cerr << "\nPlease enter a valid email address.\n";
        return 1;
    }

    const std::string payload =
        "{\"name\":\"" + jsonEscape(name) + "\","
        "\"email\":\"" + jsonEscape(email) + "\","
        "\"phone\":\"" + jsonEscape(phone) + "\","
        "\"company\":\"" + jsonEscape(company) + "\","
        "\"subject\":\"" + jsonEscape(subject) + "\","
        "\"message\":\"" + jsonEscape(message) + "\"}";

    const char* configuredUrl = std::getenv("DAVCOM_API_URL");
    const std::string apiUrl = configuredUrl == nullptr
        ? "http://127.0.0.1:3000/api/contact"
        : configuredUrl;

    try {
        const ApiUrl url = parseApiUrl(apiUrl);
        std::cout << "\nSending message...\n";
        const std::string response = sendHttpRequest(url, payload);
        const int status = responseStatus(response);

        if (status >= 200 && status < 300 && response.find("\"success\":false") == std::string::npos) {
            std::cout << "Message sent successfully to the DAVCOM executive desk.\n";
            return 0;
        }

        std::cerr << "The company API rejected the message (HTTP " << status << ").\n"
                  << "Please check the backend server and try again.\n";
        return 1;
    } catch (const std::exception& error) {
        std::cerr << "Could not send the message: " << error.what() << "\n"
                  << "Start the company server with 'npm run dev' and try again.\n";
        return 1;
    }
}