cmake_minimum_required(VERSION 3.16)
project(davcom_message_desk LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets Network)

add_executable(davcom-message-gui gui_main.cpp)
target_link_libraries(davcom-message-gui PRIVATE Qt6::Widgets Qt6::Network)