# Campusly Forum Flowchart

Signed-in user flow for web and mobile.

```mermaid
flowchart TD
    A(["Open Forum / Home"]) --> B["Select community"]
    B --> C["Browse latest posts"]

    C -->|Open post| D["Read post and comments"]
    D -->|Comment| E["Write and submit comment"]
    E --> D
    D -->|Like or Share| F["Like post or copy link"]
    F --> D
    D -->|Back| C

    C -->|New post| G["Write post and choose options"]
    G --> H["Publish post"]
    H --> I{"Saved successfully?"}
    I -->|Yes| C
    I -->|No - keep draft| G
```

- **Community:** Campus, Program, or Class. Like and Share also work directly on feed cards.
- **New post:** Body required; title optional. Choose community, category, and name or Anonymous.