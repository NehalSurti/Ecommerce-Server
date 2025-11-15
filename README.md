## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        A[React Storefront]
        F[Admin Dashboard]
    end
    
    subgraph API["API Layer"]
        B[Express.js REST API]
        G[JWT Middleware]
        H[Stripe Webhooks]
    end
    
    subgraph Data["Data Layer"]
        C[(MongoDB Atlas)]
        E[Firebase Storage]
    end
    
    subgraph External["External Services"]
        D[Stripe Checkout]
    end
    
    A -->|HTTP/HTTPS| B
    F -->|HTTP/HTTPS| B
    B --> G
    B --> C
    A -->|Payment| D
    D -->|Webhook| H
    H --> B
    A -->|Images| E
    B -->|Upload| E
```


https://github.com/user-attachments/assets/011463c3-5501-4b00-b4cf-18a6c7c77e72

https://github.com/user-attachments/assets/8b2c24f9-c69f-4020-abc5-0bd0bbc5da97

https://github.com/user-attachments/assets/cada0eee-ea3b-4765-942c-db665c4cb7ef
