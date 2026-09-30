CXX ?= g++
CXXFLAGS ?= -std=c++17 -Wall -Wextra -Wpedantic -O2
QT_CFLAGS ?= $(shell pkg-config --cflags Qt6Widgets Qt6Network 2>/dev/null)
QT_LIBS ?= $(shell pkg-config --libs Qt6Widgets Qt6Network 2>/dev/null)

GUI_TARGET := davcom-message-gui
CLI_TARGET := davcom-message-desk

.PHONY: all gui cli clean

all: $(GUI_TARGET)
gui: $(GUI_TARGET)
cli: $(CLI_TARGET)

$(GUI_TARGET): gui_main.cpp
	$(CXX) $(CXXFLAGS) $(QT_CFLAGS) $< -o $@ $(QT_LIBS)

$(CLI_TARGET): main.cpp
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -f $(GUI_TARGET) $(CLI_TARGET)