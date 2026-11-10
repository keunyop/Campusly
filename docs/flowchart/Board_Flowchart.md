# Campusly Board Flowchart

Signed-in user flow for web and mobile.

```mermaid
flowchart TD
    A(["Open Boards"])
    A --> C["Select category"]
    C --> D["Browse or search posts"]

    D -->|Open post| E["Read post and comments"]
    E -->|Comment| F["Write and submit comment"]
    F --> E
    E -->|Like or Share| G["Like post or copy link"]
    G --> E
    E -->|Back| D

    D -->|Write a post| H["Write post with current category"]
    H --> I["Publish post"]
    I --> J{"Saved successfully?"}
    J -->|Yes| K(["Home feed shows new post"])
    J -->|No - keep draft| H
```

- **Categories:** Q&A, Campus info, Events, Study resources, Marketplace, Jobs.
- **New post:** Current category are preselected. Body required; title optional. Choose name.
- **Shared content:** The new post also appears in the home feed.
