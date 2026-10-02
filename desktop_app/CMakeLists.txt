cmake_minimum_required(VERSION 3.16)
project(davcom_message_desk VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets Network)

add_executable(davcom-message-gui gui_main.cpp)
target_link_libraries(davcom-message-gui PRIVATE Qt6::Widgets Qt6::Network)

install(TARGETS davcom-message-gui
    RUNTIME DESTINATION bin
)

set(CPACK_PACKAGE_NAME "davcom-message-gui")
set(CPACK_PACKAGE_VENDOR "DAVCOM Mining Resources")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Desktop customer quote request client for DAVCOM Mining Resources")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})
set(CPACK_PACKAGE_VERSION_MAJOR ${PROJECT_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${PROJECT_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${PROJECT_VERSION_PATCH})
set(CPACK_PACKAGE_FILE_NAME "${CPACK_PACKAGE_NAME}-${CPACK_PACKAGE_VERSION}-Linux-x86_64")
set(CPACK_GENERATOR "TGZ")

include(CPack)