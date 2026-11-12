# Sơ đồ kiến trúc Tama

Sơ đồ dưới đây phản ánh mã nguồn và cấu hình triển khai hiện có. Frontend và backend được build thành hai image riêng; PostgreSQL được cấu hình qua biến môi trường. Repository hiện chưa có tệp Compose hoặc migration riêng.

```mermaid
flowchart LR
    User[Người dùng / trình duyệt]

    subgraph Frontend[Frontend · React 19 + TypeScript · Vite]
        UI[App và các trang\nDashboard · Tasks · Schedule · Projects · Settings · Login]
        Hooks[Hooks quản lý dữ liệu\nuseAuth · useTasks · useSchedule · useDashboardSummary · useSettings]
        Client[API client\nfetch + JSON · VITE_API_BASE_URL]
        UI --> Hooks --> Client
    end

    subgraph Backend[Backend · Spring Boot · Java 21 · cổng 8080]
        Web[REST Controllers\nAuth · User · Workspace · Task · Project\nSchedule · Dashboard · Preferences · Health]
        Services[Services\nXử lý nghiệp vụ]
        Repos[Spring Data JPA Repositories]
        Entities[Entities\nUser · Workspace · WorkspaceMember\nTask · Project · CalendarEvent · UserPreference]
        Config[Cấu hình\nCORS · mã hóa mật khẩu · xử lý lỗi]
        Web --> Services --> Repos --> Entities
        Config -. hỗ trợ .-> Web
    end

    DB[(PostgreSQL\ntama_db)]
    User --> UI
    Client <-->|HTTP REST · JSON\n/api| Web
    Entities <-->|JPA / Hibernate| DB

    subgraph Deploy[Build và phục vụ]
        FEImage[Docker image frontend\nVite build → Nginx · cổng 80]
        BEImage[Docker image backend\nMaven build → Java runtime · cổng 8080]
    end
    Frontend -. đóng gói thành .-> FEImage
    Backend -. đóng gói thành .-> BEImage
```

## Các miền chức năng

| Miền | Controller / service | Dữ liệu chính |
|---|---|---|
| Đăng nhập và người dùng | `AuthController`, `UserController` / `AuthService`, `UserService` | `User` |
| Không gian làm việc | `WorkspaceController` / `WorkspaceService` | `Workspace`, `WorkspaceMember`, `WorkspaceRole` |
| Công việc và dự án | `TaskController`, `ProjectController` / `TaskService`, `ProjectService` | `Task`, `Project` |
| Lịch và tổng quan | `CalendarEventController`, `DashboardController` / `CalendarEventService`, `DashboardService` | `CalendarEvent`, `Task` |
| Tùy chọn | `UserPreferenceController` / `UserPreferenceService` | `UserPreference` |

Frontend gọi API qua `frontend/src/api/client.ts`; URL mặc định là `http://localhost:8080/api` và có thể đổi bằng `VITE_API_BASE_URL`. Backend đọc kết nối PostgreSQL từ `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`; mặc định URL cơ sở dữ liệu là `jdbc:postgresql://localhost:5432/tama_db`.
