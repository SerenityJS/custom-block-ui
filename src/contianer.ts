import { Block, BlockContainer, Entity, Player, PlayerClosedContainerSignal, PlayerOpenedContainerSignal } from "@serenityjs/core";
import { AddEntityPacket, BlockPosition, ContainerId, ContainerOpenPacket, ContainerType, PropertySyncData, RemoveEntityPacket } from "@serenityjs/protocol";

class ProxyContainer extends BlockContainer {
  /**
   * The entity that will be used in the proxy transaction
  */
  public readonly entity: Entity;

  /**
   * Creates a new instance of the ProxyContainer class.
   * @param block The block that this container is associated with.
   * @param entity The entity that will be used to represent the container in the world. This entity will be spawned for players when they interact with the block.
   * @param size The size of the container (default is 27). This defines how many slots the container will have. This can be overridden by the block's state if needed.
   */
  public constructor(block: Block, entity: Entity, size: number = 27) {
    super(block, ContainerType.Container, ContainerId.None, size);

    // Assign the entity to the container
    this.entity = entity;
  }
 
  public show(player: Player): void {
    // Create a new PlayerOpenedContainerSignal to emit the event
    const signal = new PlayerOpenedContainerSignal(player, this).emit();
    if (!signal) return; // If the signal is cancelled, return early

    // Call the original show method
    super.show(player);

    // Create a new AddEntityPacket to spawn the entity for the player
    const spawn = new AddEntityPacket();
    spawn.uniqueEntityId = this.entity.uniqueId;
    spawn.runtimeId = this.entity.runtimeId;
    spawn.identifier = this.entity.identifier;
    spawn.position = BlockPosition.toVector3f(this.block.position);
    spawn.velocity = this.entity.velocity;
    spawn.pitch = this.entity.rotation.pitch;
    spawn.yaw = this.entity.rotation.yaw;
    spawn.headYaw = this.entity.rotation.headYaw;
    spawn.bodyYaw = this.entity.rotation.yaw;
    spawn.attributes = [];
    spawn.data = [...this.entity.metadata.values()];
    spawn.properties = new PropertySyncData([], []);
    spawn.links = [];

    // Create a new ContainerOpenPacket
    const packet = new ContainerOpenPacket();

    // Assign the properties
    packet.identifier = this.identifier;
    packet.type = this.type;
    packet.position = BlockPosition.fromVector3f(this.entity.position); // Use the entity's position for the packet
    packet.uniqueId = this.entity.uniqueId;

    // Send the packet to the player
    player.send(spawn, packet);
  
    // Update the container
    this.update();
  }

  public close(player: Player, serverInitiated?: boolean): void {
    // Create a new PlayerClosedContainerSignal to emit the event
    new PlayerClosedContainerSignal(player, this).emit();

    // Call the original close method
    super.close(player, serverInitiated)

    // Despawn the entity for the player
    const packet = new RemoveEntityPacket();
    packet.uniqueEntityId = this.entity.uniqueId;

    // Send the packet to the player to remove the entity
    player.send(packet);
  }
}

export { ProxyContainer };
