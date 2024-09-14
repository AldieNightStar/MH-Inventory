// Set your config in Engine.Config
namespace StoryConfig {

    // Allow V to be saved each Passage goto/reload
    Engine.Config.autoSaveOnGoto = true;
    
    // Allow V to be saved every 5 seconds
    Engine.Config.autoSaveTimer = true;
    
    // Allow to read and write some Variables into URL #anchor
    // Put here names of that variables
    Engine.Config.anchorVariables = [];
    
    // Allow to read Passage from URL #anchor
    // Will automatically add "passage" into anchorVariables
    // Good for static sites. DO NOT use arguments as they still in V[...]
    Engine.Config.passageInUrlAnchor = false;
    
    // And other
}