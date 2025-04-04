import { WorldInitializeSignal } from "@serenityjs/core";
import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";

import { ContainerProxyEntityType } from "./entity";
import { BlockProxyInventoryTrait } from "./inventory";


class CustomBlockUI extends Plugin implements PluginEvents {
  public readonly type = PluginType.Addon;

  public constructor() {
    super("custom-block-ui", "1.0.0");
  }

  public onStartUp(): void {
    // Log the successful initialization of the plugin resources
    this.logger.info("Plugin resources have been initialized and are ready to be used.");
  }

  public onShutDown(): void {
    // Iterate through all worlds in the serenity instance
    for (const world of this.serenity.getWorlds()) {
      // Unregister the custom entity type and block trait from the world
      world.entityPalette.types.delete(ContainerProxyEntityType.identifier);
      world.blockPalette.traits.delete(BlockProxyInventoryTrait.identifier);

      // Log the successful unregistration of the plugin resources
      this.logger.debug(`Successfully unregistered plugin resources from world "${world.identifier}"`);
    }
  }

  public beforeWorldInitialize({ world }: WorldInitializeSignal): boolean {
    // Register the custom entity type and block trait with the world
    world.entityPalette.registerType(ContainerProxyEntityType);
    world.blockPalette.registerTrait(BlockProxyInventoryTrait);

    // Log the successful registration of the plugin resources
    this.logger.debug(`Successfully registered plugin resources to world "${world.identifier}"`);

    return true; // Indicate that the world initialization should proceed
  }
}

export default new CustomBlockUI();
