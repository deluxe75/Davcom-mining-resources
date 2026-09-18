#include <QApplication>
#include <QFormLayout>
#include <QGroupBox>
#include <QJsonDocument>
#include <QJsonObject>
#include <QLabel>
#include <QLineEdit>
#include <QMainWindow>
#include <QMessageBox>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QPushButton>
#include <QTextEdit>
#include <QVBoxLayout>
#include <QUrl>

class MessageWindow final : public QMainWindow {
public:
    MessageWindow() {
        setWindowTitle("DAVCOM Message Desk");
        setMinimumSize(560, 620);

        auto* centralWidget = new QWidget(this);
        auto* pageLayout = new QVBoxLayout(centralWidget);
        pageLayout->setContentsMargins(28, 24, 28, 24);
        pageLayout->setSpacing(16);

        auto* title = new QLabel("DAVCOM MINING RESOURCES");
        title->setStyleSheet("font-size: 22px; font-weight: 700; color: #17212b;");
        pageLayout->addWidget(title);

        auto* subtitle = new QLabel("Send an official message to the company executive desk.");
        subtitle->setStyleSheet("color: #5d6975;");
        pageLayout->addWidget(subtitle);

        auto* formBox = new QGroupBox("Message details");
        auto* form = new QFormLayout(formBox);
        form->setLabelAlignment(Qt::AlignLeft);
        form->setFormAlignment(Qt::AlignTop);
        form->setVerticalSpacing(12);

        nameField = new QLineEdit;
        emailField = new QLineEdit;
        phoneField = new QLineEdit;
        companyField = new QLineEdit;
        subjectField = new QLineEdit;
        messageField = new QTextEdit;
        messageField->setMinimumHeight(140);
        emailField->setPlaceholderText("name@example.com");
        subjectField->setPlaceholderText("What would you like to discuss?");
        messageField->setPlaceholderText("Describe your project, requirements, or inquiry...");

        form->addRow("Full name *", nameField);
        form->addRow("Email address *", emailField);
        form->addRow("Phone number", phoneField);
        form->addRow("Company", companyField);
        form->addRow("Subject *", subjectField);
        form->addRow("Message *", messageField);
        pageLayout->addWidget(formBox);

        sendButton = new QPushButton("Send message");
        sendButton->setMinimumHeight(42);
        sendButton->setStyleSheet("QPushButton { background: #d99016; color: white; font-weight: 700; border: 0; border-radius: 4px; padding: 8px 16px; } QPushButton:hover { background: #b9780d; } QPushButton:disabled { background: #b7b7b7; }");
        pageLayout->addWidget(sendButton);

        statusLabel = new QLabel("Ready to send");
        statusLabel->setStyleSheet("color: #5d6975;");
        pageLayout->addWidget(statusLabel);

        setCentralWidget(centralWidget);
        connect(sendButton, &QPushButton::clicked, this, &MessageWindow::sendMessage);
    }

private:
    void sendMessage() {
        if (nameField->text().trimmed().isEmpty() || emailField->text().trimmed().isEmpty() ||
            subjectField->text().trimmed().isEmpty() || messageField->toPlainText().trimmed().isEmpty()) {
            QMessageBox::warning(this, "Incomplete message", "Please complete all fields marked with *.");
            return;
        }
        if (!emailField->text().contains('@') || !emailField->text().contains('.')) {
            QMessageBox::warning(this, "Invalid email", "Please enter a valid email address.");
            return;
        }

        QJsonObject body{
            {"name", nameField->text().trimmed()},
            {"email", emailField->text().trimmed()},
            {"phone", phoneField->text().trimmed()},
            {"company", companyField->text().trimmed()},
            {"subject", subjectField->text().trimmed()},
            {"message", messageField->toPlainText().trimmed()}
        };

        const QString configuredUrl = qEnvironmentVariable("DAVCOM_API_URL", "http://127.0.0.1:3000/api/contact");
        QNetworkRequest request{QUrl(configuredUrl)};
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

        sendButton->setEnabled(false);
        statusLabel->setText("Sending message...");
        QNetworkReply* reply = networkManager.post(request, QJsonDocument(body).toJson(QJsonDocument::Compact));
        connect(reply, &QNetworkReply::finished, this, [this, reply]() {
            sendButton->setEnabled(true);
            const QByteArray response = reply->readAll();
            const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300) {
                statusLabel->setText("Message sent successfully.");
                QMessageBox::information(this, "Message sent", "Your message was sent to the DAVCOM executive desk.");
                nameField->clear();
                emailField->clear();
                phoneField->clear();
                companyField->clear();
                subjectField->clear();
                messageField->clear();
            } else {
                const QJsonDocument json = QJsonDocument::fromJson(response);
                const QString serverMessage = json.object().value("message").toString();
                statusLabel->setText("Message could not be sent.");
                QMessageBox::critical(this, "Send failed", serverMessage.isEmpty() ? reply->errorString() : serverMessage);
            }
            reply->deleteLater();
        });
    }

    QNetworkAccessManager networkManager;
    QLineEdit* nameField;
    QLineEdit* emailField;
    QLineEdit* phoneField;
    QLineEdit* companyField;
    QLineEdit* subjectField;
    QTextEdit* messageField;
    QPushButton* sendButton;
    QLabel* statusLabel;
};

int main(int argc, char* argv[]) {
    QApplication application(argc, argv);
    MessageWindow window;
    window.show();
    return application.exec();
}