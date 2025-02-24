def on_deploy_click(self):
    # ... existing code ...
    
    # Log constructor arguments
    constructor_args = {
        arg.name: arg.value for arg in self.constructor_args
    }
    logger.info(f"Constructor arguments: {constructor_args}")
    
    try:
        # ... rest of existing deployment code ... 

def compose(self) -> ComposeResult:
    # ... existing code ...
    
    with Container(classes="constructor-args"):
        yield Label("Constructor Arguments", classes="section-title")
        yield ScrollableContainer(
            id="constructor-args-container",
            classes="scrollable-container"
        )
    
    # Remove any conditional wrapping around the constructor args section
    # ... rest of compose code ... 

def mount_constructor_args(self) -> None:
    container = self.query_one("#constructor-args-container")
    container.remove_children()
    
    # Always show the toggle button
    toggle = Button("Constructor Arguments", id="toggle-constructor-args")
    container.mount(toggle)
    
    # Show args if they exist, otherwise show empty state
    if self.constructor_args:
        for arg in self.constructor_args:
            container.mount(ConstructorArgInput(arg))
    else:
        container.mount(Static("No constructor arguments required", classes="empty-state")) 