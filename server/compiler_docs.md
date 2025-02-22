# Supported Contract Functions

The contract builder supports the following function types for Cairo smart contracts:

## GET Functions
- **Purpose**: Retrieve values from storage variables
- **Pattern**: Functions starting with `get_`
- **Behavior**: Read-only access to storage variables
- **Example**:
  ```cairo
  fn get_value() -> u128 {
      // Returns the value from storage
  }
  ```

## SET Functions
- **Purpose**: Update values in storage variables
- **Pattern**: Functions starting with `set_`
- **Behavior**: Write access to storage variables
- **Example**:
  ```cairo
  fn set_value(new_value: u128) {
      // Sets the storage variable to new_value
  }
  ```

## INCREMENT Functions
- **Purpose**: Increase the value of a storage variable
- **Pattern**: Functions starting with `increment_`
- **Behavior**: Adds a specified amount to the storage variable
- **Parameters**: Optional amount parameter (defaults to 1)
- **Example**:
  ```cairo
  fn increment_value() {
      // Increments the storage variable by specified amount
  }
  ```

## DECREMENT Functions
- **Purpose**: Decrease the value of a storage variable
- **Pattern**: Functions starting with `decrement_`
- **Behavior**: Subtracts a specified amount from the storage variable
- **Parameters**: Optional amount parameter (defaults to 1)
- **Example**:
  ```cairo
  fn decrement_value() {
      // Decrements the storage variable by specified amount
  }
  ```

## Storage Variable Types
The contract builder supports various primitive and compound types for storage variables. The specific types available depend on the `language.json` configuration file.

## Notes
- All functions are automatically generated with proper storage access traits
- Functions are generated based on the nodes and edges defined in the JSON input
- Storage variables must be properly connected to their respective function nodes
- Each function must be associated with a storage variable