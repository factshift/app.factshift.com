import {runHelpCommand}                        from "./help";
import {runHomeCommand}                        from "./home";
import {runDemoCommand}                        from "./demo";
import {runAllCommand}                         from "./all";
import {runClickedCommand}                     from "./clicked";
import {runSaveCommand}                        from "./save";
import {runUnfreezeCommand}                    from "./unfreeze";
import {runFreezeCommand}                      from "./freeze";
import {runClusterCommand}                     from "./cluster";
import {runMinimalismCommand}                  from "./minimalism";
import {runScatterCommand}                     from "./scatter";
import {runLinkCommand}                        from "./link";
import {runBoneCommand}                        from "./bone";
import {runBaneCommand}                        from "./bane";
import {runBoonCommand}                        from "./boon";
import {runHonkCommand}                        from "./honk";
import {runBonkCommand}                        from "./bonk";
import {runTitleCommand}                       from "./title";
import {runDisplayNodesCommand}                from "./display-nodes";
import {runClearPageImageCommand}              from "./clear-page-image";
import {runClearCommand}                       from "./clear";
import {extendMenu, runMoreMenuOptionsCommand} from "./extended-menu";
import {runForcesCommand}                      from "./forces";
import {runCollisionRadiusCommand}             from "./collision-radius";
import {runSpwashiCommand}                     from "./spwashi";
import {runScaleCommand}                       from "./scale";
import {runArrangeCommand}                     from "./arrange";
import {runPruneCommand}                       from "./prune";
import {runNoCenterCommand}                    from "./no-center";
import {runCenterCommand}                      from "./center";
import {runGroupCommand}                       from "./group";
import {runSelectedCommand}                    from "./selected";
import {runUnlinkCommand}                      from "./unlink";
import {runSortCommand}                        from "./sort";
import * as sounds                             from "./sounds";


const optionsCommand = sideEffects => {
  sideEffects.valueStrings.push(...Object.keys(commands).filter(key => ![
    'options',
    'clear',
    'save',
    'home',
    'help',
  ].includes(key)).map(key => key + '\n'));
  sideEffects.nextDocumentMode = 'spw';
};

export const commands = {
  'home':           () => runHomeCommand(),
  'clear':          () => runClearCommand(),
  'save':           () => runSaveCommand(),
  'freeze':         () => runFreezeCommand(),
  'unfreeze':       () => runUnfreezeCommand(),
  'unfix':          () => runUnfreezeCommand(),
  'center':         () => runCenterCommand(),
  'no center':      () => runNoCenterCommand(),
  'enable sounds':  () => sounds.runEnableSoundsCommand(),
  'disable sounds': () => sounds.runDisableSoundsCommand(),
  'sort':           () => runSortCommand(),
  'unlink':         sideEffects => runUnlinkCommand(sideEffects),
  'prune':          sideEffects => runPruneCommand(sideEffects),
  'group':          sideEffects => runGroupCommand(sideEffects),
  'help':           sideEffects => runHelpCommand(sideEffects),
  'spwashi':        sideEffects => runSpwashiCommand(sideEffects),
  'color':          sideEffects => runScaleCommand(sideEffects),
  'forces':         sideEffects => runForcesCommand(sideEffects),
  'cr':             sideEffects => runCollisionRadiusCommand(sideEffects),
  'selected':       sideEffects => runSelectedCommand(sideEffects),
  'all':            sideEffects => runAllCommand(sideEffects),
  'clicked':        sideEffects => runClickedCommand(sideEffects),
  'cluster':        sideEffects => runClusterCommand(sideEffects),
  'scatter':        sideEffects => runScatterCommand(sideEffects),
  'arrange':        sideEffects => runArrangeCommand(sideEffects),
  'demo':           sideEffects => runDemoCommand(sideEffects),
  'link':           sideEffects => runLinkCommand(sideEffects),
  'title':          sideEffects => runTitleCommand(sideEffects),
  'minimalism':     () => runMinimalismCommand(),
  'boon':           () => runBoonCommand(),
  'bane':           () => runBaneCommand(),
  'bone':           () => runBoneCommand(),
  'honk':           () => runHonkCommand(),
  'bonk':           () => runBonkCommand(),
  'nodesonly':      () => runDisplayNodesCommand(),
  'noimage':        () => runClearPageImageCommand(),
  [extendMenu]:     () => runMoreMenuOptionsCommand(),

  'options': optionsCommand
};