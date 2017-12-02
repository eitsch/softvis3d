import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";
import { KeyLegend } from "./KeyLegend";
import { SceneKeyInteractions } from "./events/SceneKeyInteractions";
import ThreeSceneService from "./visualization/ThreeSceneService";
import ColorThemeSelector from "../../classes/ColorThemeSelector";
import SceneCanvas from "./SceneCanvas";

interface SceneProps {
    sceneStore: SceneStore;
}

interface SceneStates {
    mounted: boolean;
    focus: boolean;
    legend: boolean;
}
/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, SceneStates> {

    public static SCENE_CONTAINER_ID = "scene-container";

    private _threeSceneService: ThreeSceneService;
    private _keyActions: SceneKeyInteractions;
    private canvasState: string = "";
    private selectedObjectIdState: string | null;

    constructor() {
        super();
        this.state = {
            mounted: false,
            focus: false,
            legend: true
        };
    }

    public componentDidMount() {
        this._threeSceneService = ThreeSceneService.create();

        this._keyActions = new SceneKeyInteractions();
        this._keyActions.onResetCameraEvent.addEventListener(this.resetCamera.bind(this));
        this._keyActions.onToggleLegendEvent.addEventListener(this.toggleLegend.bind(this));
        this._keyActions.onToggleColorThemeEvent.addEventListener(this.onToggleColorTheme.bind(this));

        this.setState({...this.state, mounted: true});
    }

    public componentWillUnmount() {
        this._keyActions.destroy();
        this.setState({...this.state, mounted: false});

        this._threeSceneService.destroy();
    }

    public render() {
        const {sceneStore} = this.props;
        const {focus, legend, mounted} = this.state;

        if (mounted) {
            if (sceneStore.shapesHash !== this.canvasState) {
                this._threeSceneService.update(
                    sceneStore.shapes, sceneStore.options, sceneStore.colorTheme, sceneStore.cameraPosition);
                this.updateCameraPosition();
                this.canvasState = sceneStore.shapesHash;
            } else if (sceneStore.selectedObjectId !== this.selectedObjectIdState) {
                this._threeSceneService.selectSceneTreeObject(sceneStore.selectedObjectId);
                this.selectedObjectIdState = sceneStore.selectedObjectId;
            }
        }

        let cssClass = "scene";
        cssClass += focus ? " active" : "";

        return (
            <div id={Scene.SCENE_CONTAINER_ID} className={cssClass}>
                <KeyLegend show={legend}/>
                <SceneCanvas selectObject={this.selectObject.bind(this)}
                             updateCameraPosition={this.updateCameraPosition.bind(this)}
                             updateSceneFocusState={this.updateSceneFocusState.bind(this)}
                />
                <SceneInformation sceneStore={sceneStore}/>
            </div>
        );
    }

    public updateCameraPosition() {
        this.props.sceneStore.cameraPosition = this._threeSceneService.getCameraPosition();
    }

    /**
     * Test injection setter
     */

    public set threeSceneService(value: ThreeSceneService) {
        this._threeSceneService = value;
    }

    public set keyActions(value: SceneKeyInteractions) {
        this._keyActions = value;
    }

    /**
     * private methods
     */

    private updateSceneFocusState(newState: boolean) {
        this.setState({...this.state, focus: newState});

        if (newState) {
            this._keyActions.resume();
        } else {
            this._keyActions.halt();
        }
    }

    private selectObject(event: MouseEvent) {
        this.props.sceneStore.selectedObjectId = this._threeSceneService.makeSelection(event);
    }

    private resetCamera() {
        this._threeSceneService.resetCameraPosition(this.props.sceneStore.shapes);
    }

    private toggleLegend() {
        this.setState({...this.state, legend: !this.state.legend});
    }

    private onToggleColorTheme() {
        let resultColorTheme = ColorThemeSelector.toggleColorTheme(this.props.sceneStore.colorTheme);

        this._threeSceneService.setColorTheme(resultColorTheme);
        this.props.sceneStore.colorTheme = resultColorTheme;
    }

}
