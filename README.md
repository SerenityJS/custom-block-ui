# Introduction
This plugin allows plugin developers to add custom container ui to their custom block types.

## Plugin Usage
To add a custom container to your new block type, you will need to define a permutation with the states `container_size` and optionally `container_name`. These state definitions will automatically bind a custom container ui, as long as the plugin is active. If a `container_name` state isn't provided, the name will default to the identifier of the block.

![]()

```ts
import { CustomBlockType } from "@serenityjs/core";

// First create a new custom block type.
const customContainer = new CustomBlockType("test:custom_container");

// Next, we need to make the block type interactable.
customContainer.components.setIsInteractable(true);

// Finally, we need to create a permutation with the required states.
customContainer.createPermutation({ container_size: 27, container_name: "Custom Container" })
```