#include <QApplication>
#include <QAbstractItemView>
#include <QComboBox>
#include <QFormLayout>
#include <QFrame>
#include <QGridLayout>
#include <QHeaderView>
#include <QGroupBox>
#include <QHBoxLayout>
#include <QJsonArray>
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
#include <QStackedWidget>
#include <QTableWidget>
#include <QTableWidgetItem>
#include <QTabWidget>
#include <QTextEdit>
#include <QVBoxLayout>
#include <QWidget>
#include <QUrl>

class MessageWindow final : public QMainWindow {
public:
    MessageWindow() {
        setWindowTitle("DAVCOM Operations Dashboard");
        setMinimumSize(980, 680);
        resize(1180, 780);
        setStyleSheet(
            "QMainWindow, QWidget#page { background: #101820; color: #e7edf2; }"
            "QLabel { color: #e7edf2; }"
            "QLineEdit { background: #18232d; color: #f4f6f8; border: 1px solid #34434f; border-radius: 4px; padding: 10px; }"
            "QLineEdit:focus { border-color: #e0a52b; }"
            "QPushButton { background: #e0a52b; color: #151b20; border: 0; border-radius: 4px; padding: 9px 14px; font-weight: 700; }"
            "QPushButton:hover { background: #f0b83f; }"
            "QPushButton:disabled { background: #52606a; color: #c1c9cf; }"
            "QTabWidget::pane { border: 1px solid #293742; top: -1px; }"
            "QTabBar::tab { background: #18232d; color: #b7c1c9; padding: 10px 16px; margin-right: 3px; }"
            "QTabBar::tab:selected { background: #263541; color: #f0b83f; border-bottom: 2px solid #e0a52b; }"
            "QTableWidget { background: #131e27; alternate-background-color: #18232d; color: #e7edf2; gridline-color: #293742; border: 1px solid #293742; selection-background-color: #394957; }"
            "QHeaderView::section { background: #202d37; color: #cbd4da; border: 0; padding: 8px; font-weight: 700; }"
        );

        apiBase = qEnvironmentVariable("DAVCOM_API_BASE", "http://127.0.0.1:3000/api");
        if (apiBase.endsWith('/')) apiBase.chop(1);

        pages = new QStackedWidget(this);
        pages->addWidget(createLoginPage());
        pages->addWidget(createDashboardPage());
        setCentralWidget(pages);
        pages->setCurrentIndex(0);
    }

private:
    QWidget* createLoginPage() {
        auto* page = new QWidget;
        page->setObjectName("page");
        auto* outer = new QVBoxLayout(page);
        outer->setContentsMargins(40, 32, 40, 32);
        outer->addStretch();

        auto* panel = new QWidget;
        panel->setMaximumWidth(480);
        auto* layout = new QVBoxLayout(panel);
        layout->setSpacing(14);

        auto* brand = new QLabel("DAVCOM  /  OPERATIONS");
        brand->setStyleSheet("color: #e0a52b; font-size: 13px; font-weight: 700; letter-spacing: 1px;");
        layout->addWidget(brand);

        auto* title = new QLabel("Website activity dashboard");
        title->setStyleSheet("font-size: 27px; font-weight: 700;");
        layout->addWidget(title);
        auto* subtitle = new QLabel("Sign in with an authorized DAVCOM admin account to review recent website activity.");
        subtitle->setWordWrap(true);
        subtitle->setStyleSheet("color: #a6b2bb;");
        layout->addWidget(subtitle);

        emailField = new QLineEdit;
        emailField->setPlaceholderText("Admin email");
        emailField->setText(qEnvironmentVariable("DAVCOM_ADMIN_EMAIL"));
        passwordField = new QLineEdit;
        passwordField->setPlaceholderText("Password");
        passwordField->setEchoMode(QLineEdit::Password);
        layout->addSpacing(8);
        layout->addWidget(emailField);
        layout->addWidget(passwordField);

        loginButton = new QPushButton("Sign in");
        loginButton->setMinimumHeight(42);
        layout->addWidget(loginButton);
        loginStatus = new QLabel("API: " + apiBase);
        loginStatus->setWordWrap(true);
        loginStatus->setStyleSheet("color: #9ba8b2; font-size: 11px;");
        layout->addWidget(loginStatus);

        auto* centeredPanel = new QHBoxLayout;
        centeredPanel->addStretch();
        centeredPanel->addWidget(panel);
        centeredPanel->addStretch();
        outer->addLayout(centeredPanel);
        outer->addStretch();

        connect(loginButton, &QPushButton::clicked, this, &MessageWindow::login);
        connect(passwordField, &QLineEdit::returnPressed, this, &MessageWindow::login);
        return page;
    }

    QWidget* createDashboardPage() {
        auto* page = new QWidget;
        page->setObjectName("page");
        auto* layout = new QVBoxLayout(page);
        layout->setContentsMargins(24, 20, 24, 20);
        layout->setSpacing(14);

        auto* header = new QHBoxLayout;
        auto* headingBlock = new QVBoxLayout;
        auto* title = new QLabel("Website activity");
        title->setStyleSheet("font-size: 24px; font-weight: 700;");
        headingBlock->addWidget(title);
        adminLabel = new QLabel;
        adminLabel->setStyleSheet("color: #a6b2bb; font-size: 12px;");
        headingBlock->addWidget(adminLabel);
        header->addLayout(headingBlock);
        header->addStretch();
        refreshButton = new QPushButton("Refresh activity");
        logoutButton = new QPushButton("Sign out");
        logoutButton->setStyleSheet("QPushButton { background: #263541; color: #e7edf2; }");
        header->addWidget(refreshButton);
        header->addWidget(logoutButton);
        layout->addLayout(header);

        auto* statsLayout = new QGridLayout;
        statsLayout->setSpacing(10);
        const QStringList labels{"New enquiries", "Pending requests", "Projects", "Services", "Equipment", "Gallery images"};
        for (int index = 0; index < labels.size(); ++index) {
            auto* card = new QFrame;
            card->setStyleSheet("QFrame { background: #18232d; border: 1px solid #293742; border-radius: 4px; }");
            auto* cardLayout = new QVBoxLayout(card);
            cardLayout->setContentsMargins(14, 12, 14, 12);
            auto* label = new QLabel(labels[index]);
            label->setStyleSheet("color: #a6b2bb; font-size: 11px; border: 0;");
            auto* value = new QLabel("--");
            value->setStyleSheet("color: #f0b83f; font-size: 24px; font-weight: 700; border: 0;");
            cardLayout->addWidget(label);
            cardLayout->addWidget(value);
            statsLayout->addWidget(card, index / 3, index % 3);
            statValues.append(value);
        }
        layout->addLayout(statsLayout);

        tabs = new QTabWidget;
        enquiriesTable = createTable({"Received", "Name", "Email", "Subject", "Status"});
        requestsTable = createTable({"Received", "Name", "Company", "Service", "Status"});
        requestsTable->setSelectionMode(QAbstractItemView::SingleSelection);
        projectsTable = createTable({"Added", "Project", "Category", "Status"});
        tabs->addTab(enquiriesTable, "Enquiries");
        tabs->addTab(requestsTable, "Service & quote requests");
        tabs->addTab(projectsTable, "Projects");
        layout->addWidget(tabs, 1);

        auto* reviewPanel = createQuoteReviewPanel();
        layout->addWidget(reviewPanel);

        dashboardStatus = new QLabel("Sign in to load activity.");
        dashboardStatus->setStyleSheet("color: #9ba8b2; font-size: 11px;");
        layout->addWidget(dashboardStatus);

        connect(refreshButton, &QPushButton::clicked, this, &MessageWindow::loadDashboard);
        connect(logoutButton, &QPushButton::clicked, this, [this]() {
            token.clear();
            pages->setCurrentIndex(0);
            passwordField->clear();
            loginStatus->setText("Signed out.");
        });
        connect(requestsTable->selectionModel(), &QItemSelectionModel::selectionChanged, this, &MessageWindow::updateSelectedQuoteReview);
        return page;
    }

    QWidget* createQuoteReviewPanel() {
        auto* panel = new QWidget;
        panel->setStyleSheet("QWidget { background: #18232d; border: 1px solid #293742; border-radius: 8px; }"
            "QLabel { color: #e7edf2; }"
            "QPlainTextEdit { background: #0d1720; color: #e7edf2; border: 1px solid #34434f; border-radius: 6px; padding: 8px; }"
            "QComboBox { background: #0d1720; color: #e7edf2; border: 1px solid #34434f; border-radius: 6px; padding: 8px; }"
            "QPushButton { background: #e0a52b; color: #151b20; border: 0; border-radius: 4px; padding: 8px 12px; font-weight: 700; }");
        auto* topLayout = new QVBoxLayout(panel);
        topLayout->setContentsMargins(16, 14, 16, 14);
        topLayout->setSpacing(10);

        auto* header = new QHBoxLayout;
        auto* title = new QLabel("Review selected quote request");
        title->setStyleSheet("font-size: 16px; font-weight: 700; color: #f0b83f;");
        header->addWidget(title);
        header->addStretch();
        quoteReviewLabel = new QLabel("No request selected");
        quoteReviewLabel->setStyleSheet("color: #a6b2bb; font-size: 11px;");
        header->addWidget(quoteReviewLabel);
        topLayout->addLayout(header);

        auto* formLayout = new QFormLayout;
        formLayout->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
        quoteStatusCombo = new QComboBox;
        quoteStatusCombo->addItems({"Pending", "In Review", "Approved", "Rejected"});
        quoteStatusCombo->setEnabled(false);
        quoteNotesEdit = new QTextEdit;
        quoteNotesEdit->setPlaceholderText("Add review notes, approval conditions, or reasons for rejection...");
        quoteNotesEdit->setEnabled(false);
        quoteNotesEdit->setMaximumHeight(110);
        formLayout->addRow("Status", quoteStatusCombo);
        formLayout->addRow("Admin notes", quoteNotesEdit);
        topLayout->addLayout(formLayout);

        saveQuoteButton = new QPushButton("Save review decision");
        saveQuoteButton->setEnabled(false);
        topLayout->addWidget(saveQuoteButton, 0, Qt::AlignRight);

        connect(saveQuoteButton, &QPushButton::clicked, this, &MessageWindow::saveSelectedQuoteReview);
        return panel;
    }

    QTableWidget* createTable(const QStringList& columns) {
        auto* table = new QTableWidget(0, columns.size());
        table->setHorizontalHeaderLabels(columns);
        table->setEditTriggers(QAbstractItemView::NoEditTriggers);
        table->setSelectionBehavior(QAbstractItemView::SelectRows);
        table->setAlternatingRowColors(true);
        table->setWordWrap(false);
        table->verticalHeader()->hide();
        table->horizontalHeader()->setSectionResizeMode(QHeaderView::ResizeToContents);
        table->horizontalHeader()->setStretchLastSection(true);
        return table;
    }

    QNetworkRequest makeRequest(const QString& path, bool authenticated = true) const {
        QNetworkRequest request{QUrl(apiBase + path)};
        request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
        request.setRawHeader("Accept", "application/json");
        if (authenticated && !token.isEmpty()) {
            request.setRawHeader("Authorization", "Bearer " + token.toUtf8());
        }
        return request;
    }

    QJsonObject responseData(const QByteArray& response) const {
        return QJsonDocument::fromJson(response).object().value("data").toObject();
    }

    QString responseMessage(const QByteArray& response, const QString& fallback) const {
        const QJsonObject json = QJsonDocument::fromJson(response).object();
        const QString message = json.value("message").toString();
        return message.isEmpty() ? fallback : message;
    }

    void login() {
        const QString email = emailField->text().trimmed();
        if (email.isEmpty() || passwordField->text().isEmpty()) {
            loginStatus->setText("Enter both your admin email and password.");
            return;
        }

        loginButton->setEnabled(false);
        loginStatus->setText("Signing in...");
        const QJsonObject body{{"email", email}, {"password", passwordField->text()}};
        QNetworkReply* reply = networkManager.post(makeRequest("/auth/login", false), QJsonDocument(body).toJson(QJsonDocument::Compact));
        connect(reply, &QNetworkReply::finished, this, [this, reply]() {
            loginButton->setEnabled(true);
            const QByteArray response = reply->readAll();
            const QJsonObject json = QJsonDocument::fromJson(response).object();
            const QJsonObject data = json.value("data").toObject();
            const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300 && json.value("success").toBool()) {
                token = data.value("token").toString();
                const QJsonObject admin = data.value("admin").toObject();
                adminLabel->setText(admin.value("name").toString() + "  ·  " + admin.value("email").toString());
                passwordField->clear();
                pages->setCurrentIndex(1);
                loadDashboard();
            } else {
                loginStatus->setText(responseMessage(response, reply->error() == QNetworkReply::NoError ? "Sign-in failed." : reply->errorString()));
            }
            reply->deleteLater();
        });
    }

    void loadDashboard() {
        refreshButton->setEnabled(false);
        dashboardStatus->setText("Loading latest website activity...");
        pendingRequests = 4;
        loadHadError = false;
        loadStats();
        loadTable("/contact/messages", enquiriesTable, {"created_at", "name", "email", "subject", "status"});
        loadTable("/service-requests/all", requestsTable, {"created_at", "name", "company", "service", "status"});
        loadTable("/projects", projectsTable, {"created_at", "title", "category", "status"});
    }

    void loadStats() {
        QNetworkReply* reply = networkManager.get(makeRequest("/dashboard/stats"));
        connect(reply, &QNetworkReply::finished, this, [this, reply]() {
            const QByteArray response = reply->readAll();
            const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300) {
                const QJsonObject counts = responseData(response).value("counts").toObject();
                const QStringList keys{"new_enquiries", "pending_service_requests", "total_projects", "total_services", "total_equipment", "gallery_images"};
                for (int index = 0; index < keys.size() && index < statValues.size(); ++index) {
                    statValues[index]->setText(QString::number(counts.value(keys[index]).toInt()));
                }
            } else if (statusCode == 401) {
                expireSession();
            } else {
                loadHadError = true;
                dashboardStatus->setText(responseMessage(response, reply->errorString()));
            }
            reply->deleteLater();
            finishDashboardRequest();
        });
    }

    void loadTable(const QString& path, QTableWidget* table, const QStringList& fields) {
        QNetworkReply* reply = networkManager.get(makeRequest(path));
        connect(reply, &QNetworkReply::finished, this, [this, reply, table, fields]() {
            const QByteArray response = reply->readAll();
            const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300) {
                const QJsonArray rows = responseData(response).value("items").toArray();
                const QJsonValue payload = QJsonDocument::fromJson(response).object().value("data");
                const QJsonArray dataRows = payload.isArray() ? payload.toArray() : rows;
                table->setRowCount(dataRows.size());
                if (table == requestsTable) {
                    requestData.clear();
                    requestData.reserve(dataRows.size());
                }
                for (int row = 0; row < dataRows.size(); ++row) {
                    const QJsonObject record = dataRows[row].toObject();
                    if (table == requestsTable) {
                        requestData.append(record);
                    }
                    for (int column = 0; column < fields.size(); ++column) {
                        QString value = record.value(fields[column]).toVariant().toString();
                        if (value.isEmpty()) value = "—";
                        auto* item = new QTableWidgetItem(value);
                        item->setToolTip(value);
                        table->setItem(row, column, item);
                    }
                }
            } else if (statusCode == 401) {
                expireSession();
            } else {
                loadHadError = true;
                dashboardStatus->setText(responseMessage(response, reply->errorString()));
            }
            reply->deleteLater();
            finishDashboardRequest();
        });
    }

    void updateSelectedQuoteReview() {
        if (requestsTable->selectedItems().isEmpty()) {
            quoteReviewLabel->setText("No request selected");
            quoteStatusCombo->setEnabled(false);
            quoteNotesEdit->setEnabled(false);
            saveQuoteButton->setEnabled(false);
            quoteStatusCombo->setCurrentText("Pending");
            quoteNotesEdit->clear();
            return;
        }

        const int row = requestsTable->currentRow();
        if (row < 0 || row >= requestData.size()) {
            return;
        }

        const QJsonObject record = requestData.at(row);
        quoteReviewLabel->setText("DMR-" + QString::number(record.value("id").toInt()));
        quoteStatusCombo->setEnabled(true);
        quoteNotesEdit->setEnabled(true);
        saveQuoteButton->setEnabled(true);

        const QString status = record.value("status").toString();
        const QString normalized = status == "In Review" ? "In Review" : (status == "Approved" ? "Approved" : (status == "Rejected" ? "Rejected" : "Pending"));
        quoteStatusCombo->setCurrentText(normalized);
        quoteNotesEdit->setPlainText(record.value("admin_notes").toString());
    }

    void saveSelectedQuoteReview() {
        if (requestsTable->selectedItems().isEmpty()) {
            return;
        }

        const int row = requestsTable->currentRow();
        if (row < 0 || row >= requestData.size()) {
            return;
        }

        const QJsonObject record = requestData.at(row);
        const int id = record.value("id").toInt();
        const QString status = quoteStatusCombo->currentText();
        const QString notes = quoteNotesEdit->toPlainText().trimmed();

        saveQuoteButton->setEnabled(false);
        dashboardStatus->setText("Saving quote review...");

        QJsonObject payload;
        payload["id"] = id;
        payload["status"] = status;
        payload["admin_notes"] = notes;

        QNetworkReply* reply = networkManager.post(makeRequest("/service-requests/update-status"), QJsonDocument(payload).toJson(QJsonDocument::Compact));
        connect(reply, &QNetworkReply::finished, this, [this, reply, id]() {
            const QByteArray response = reply->readAll();
            const int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            if (reply->error() == QNetworkReply::NoError && statusCode >= 200 && statusCode < 300) {
                dashboardStatus->setText("Quote review saved successfully.");
                loadDashboard();
            } else {
                dashboardStatus->setText(responseMessage(response, reply->errorString()));
                saveQuoteButton->setEnabled(true);
            }
            reply->deleteLater();
        });
    }

    void finishDashboardRequest() {
        --pendingRequests;
        if (pendingRequests <= 0) {
            refreshButton->setEnabled(true);
            if (!loadHadError && !token.isEmpty()) {
                dashboardStatus->setText("Activity refreshed from the website API.");
            }
        }
    }

    void expireSession() {
        token.clear();
        pages->setCurrentIndex(0);
        loginStatus->setText("Your admin session expired. Please sign in again.");
    }

    QNetworkAccessManager networkManager;
    QString apiBase;
    QString token;
    QStackedWidget* pages;
    QLineEdit* emailField;
    QLineEdit* passwordField;
    QPushButton* loginButton;
    QLabel* loginStatus;
    QLabel* adminLabel;
    QLabel* dashboardStatus;
    QPushButton* refreshButton;
    QPushButton* logoutButton;
    QTabWidget* tabs;
    QTableWidget* enquiriesTable;
    QTableWidget* requestsTable;
    QTableWidget* projectsTable;
    QLabel* quoteReviewLabel = nullptr;
    QComboBox* quoteStatusCombo = nullptr;
    QTextEdit* quoteNotesEdit = nullptr;
    QPushButton* saveQuoteButton = nullptr;
    QVector<QJsonObject> requestData;
    QList<QLabel*> statValues;
    int pendingRequests = 0;
    bool loadHadError = false;
};

int main(int argc, char* argv[]) {
    QApplication application(argc, argv);
    MessageWindow window;
    window.show();
    return application.exec();
}