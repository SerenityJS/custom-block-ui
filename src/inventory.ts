import { Block, BlockInventoryTrait, Entity } from "@serenityjs/core";

import { ContainerProxyEntityType } from "./entity"
import { ProxyContainer } from "./contianer";
import { ActorDataId, ActorDataType, DataItem } from "@serenityjs/protocol";

interface BlockProxyInventoryTraitOptions {
  /**
   * The size of the proxy inventory. This defines how many slots the container will have.
   */
  containerSize?: number;

  /**
   * The name of the container that will be used for the proxy inventory. This can be used to identify the container in logs or other debugging information.
   */
  containerName?: string;
}

class BlockProxyInventoryTrait extends BlockInventoryTrait {
  public static readonly identifier = "proxy_inventory"
  public static readonly state = "container_size" // Will automatically bind to a block if the block has a `container_size` state
  public static readonly types = []

  /**
   * The entity that is used to represent the proxy inventory.
  */
  public readonly entity: Entity;

  /**
   * Create a new BlockProxyInventoryTrait instance.
   * @param block The block that this trait is associated with.
   */
  public constructor(block: Block, options: BlockProxyInventoryTraitOptions = {}) {
    super(block)

    // Check if the block has a custom state for the proxy inventory size
    if (block.getState("container_size")) {
      // If the block has a custom state for the proxy inventory size, use that value
      options.containerSize = block.getState<number>("container_size");
    } else if (options.containerSize === undefined) {
      // If no size is provided and the block doesn't have a custom state, default to 27
      // This is a common default for container sizes in Minecraft
      options.containerSize = 27; // Default size for the container if not specified
    }

    // Create a new entity for the proxy inventory
    this.entity = new Entity(this.dimension, ContainerProxyEntityType);

    // Check if the block has a custom name for the entity
    if (block.getState("container_name")) {
      // If the block has a custom name for the container, use that value
      // This allows for custom naming of the container for debugging or logging purposes
      this.entity.nameTag = block.getState<string>("container_name");
    } else if (options.containerName) {
      // If a container name is provided in the options, use that value
      // This allows for custom naming of the container for debugging or logging purposes
      this.entity.nameTag = options.containerName;
    } else {
      // Otherwise, default to the block's identifier as the name tag for the entity
      // This ensures that the entity has a meaningful name by default, matching the block's identifier
      this.entity.nameTag = block.identifier; // Default name tag for the entity if no custom name is provided
    }

    // Create a new proxy container for the block
    this.container = new ProxyContainer(block, this.entity, options.containerSize);

    // Create metadata that defines the container type and size
    const typeData = new DataItem(ActorDataId.ContainerType, ActorDataType.Byte, this.container.type);
    const sizeData = new DataItem(ActorDataId.ContainerSize, ActorDataType.Int, this.container.size);

    // Set the entity's actor data to include the container type and size
    this.entity.metadata.set(ActorDataId.ContainerType, typeData); // Set the container type
    this.entity.metadata.set(ActorDataId.ContainerSize, sizeData); // Set the container size
  }
}

export { BlockProxyInventoryTrait };
