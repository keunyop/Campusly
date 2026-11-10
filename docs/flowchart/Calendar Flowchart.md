# Campusly Calendar Flowchart

Calendar flow for choosing a view and adding an event.

```mermaid
flowchart TD
    A(["Click Calendar"]) --> B["Calendar displayed"]
    B --> C["View Select"]

    C -->|Week| D["Week View"]
    D --> E["Add Event"]
    E -->|Yes| F["Event Added"]
    F --> D["Week View"]
    E -->|No| D["Week View"]
 

    C -->|Month| G["Month View"]
    G --> E["Add Event"]
    E -->|Yes| F["Event Added"]
    F --> G["Month View"]
    E -->|No| G["Month View"]
    

```

- **View selection:** Open Calendar and choose the Week or Month view.
- **Add event:** Start adding an event from either view.
- **Return to calendar:** After the event is added, or if the user does not add it, return to the selected view.
