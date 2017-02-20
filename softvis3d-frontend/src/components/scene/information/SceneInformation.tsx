import * as React from "react";
import {observer} from "mobx-react";
import MetricKey from "./MetricKey";
import {SceneStore} from "../../../stores/SceneStore";
import SelectBoxBuilder from "../../ui/selectbox/SelectBoxBuilder";
import {availableColorMetrics} from "../../../constants/Metrics";
import MetricSet from "../../../classes/MetricSet";
import ColorMetric from "../../../classes/ColorMetric";

interface SceneInformationProps {
    sceneStore: SceneStore;
}

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class SceneInformation extends React.Component<SceneInformationProps, any> {

    public render() {
        const {sceneStore} = this.props;
        const selectedElement = sceneStore.selectedElement;

        let colorInformation = this.renderColorInformation();

        return (
            <div className="scene-information">
                <MetricKey title="Width" metric={sceneStore.options.metricWidth} selectedElement={selectedElement}/>
                <MetricKey title="Height" metric={sceneStore.options.metricHeight} selectedElement={selectedElement}/>
                <SelectBoxBuilder
                    label="Color"
                    className="metric-info"
                    value={sceneStore.options.metricColor}
                    options={new MetricSet(availableColorMetrics).asSelectOptions}
                    onChange={(m: ColorMetric) => { sceneStore.options.metricColor = m; }}
                    append={colorInformation}
                />
            </div>
        );
    }

    private renderColorInformation(): JSX.Element[] {
        const colorValue = this.props.sceneStore.getColorValue();
        let colorInformation: JSX.Element[] = [];
        if (colorValue !== null) {
            colorInformation.push(<span className="value">{colorValue}</span>);
        }
        return colorInformation;
    }
}
