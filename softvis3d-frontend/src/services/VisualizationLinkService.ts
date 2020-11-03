import {Vector3} from "three";
import {AppConfiguration} from "../classes/AppConfiguration";
import HouseColorMode from "../classes/HouseColorMode";
import Layout from "../classes/Layout";
import Metric from "../classes/Metric";
import Scale from "../classes/Scale";
import {SceneColorTheme} from "../classes/SceneColorTheme";
import VisualizationLinkParams from "../classes/VisualizationLinkParams";
import {DEFAULT_HOUSE_COLOR_MODE, HouseColorModes} from "../constants/HouseColorModes";
import {Layouts} from "../constants/Layouts";
import {ColorMetrics} from "../constants/Metrics";
import {custom} from "../constants/Profiles";
import {Scales} from "../constants/Scales";
import {DEFAULT_COLOR_THEME, SceneColorThemes} from "../constants/SceneColorThemes";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {SceneStore} from "../stores/SceneStore";
import {default as UrlParameterService, Parameters} from "./UrlParameterService";

export default class VisualizationLinkService {

    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;
    private config: AppConfiguration;

    constructor(config: AppConfiguration, cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.config = config;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public process(search: string) {
        let params: Parameters = UrlParameterService.getQueryParams(search);

        let metricFootprint: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricFootprint);
        let metricHeight: Metric | undefined =
            this.cityBuilderStore.genericMetrics.getMetricByKey(params.metricHeight);

        let metricColor: Metric | undefined = ColorMetrics.getColorMetricById(params.metricColor);

        let layout: Layout | undefined = Layouts.getLayoutById(params.layout);
        let scale: Scale | undefined = Scales.getScaleById(params.scale);

        let cameraPosition = this.getCameraPosition(params);
        let colorTheme: SceneColorTheme | undefined = SceneColorThemes.getColorThemeById(params.colorTheme);

        let selectedObjectId: string | undefined = params.selectedObjectId;

        let houseColorMode: HouseColorMode | undefined = HouseColorModes.getModeById(params.houseColorMode);

        if (metricFootprint !== undefined
            && metricHeight !== undefined
            && metricColor !== undefined
            && layout !== undefined
            && scale !== undefined
            && cameraPosition !== undefined
        ) {
            if (colorTheme === undefined) {
                colorTheme = DEFAULT_COLOR_THEME;
            }
            if (houseColorMode === undefined) {
                houseColorMode = DEFAULT_HOUSE_COLOR_MODE;
            }

            let visualizationLinkParams: VisualizationLinkParams = new VisualizationLinkParams(
                metricFootprint.id, metricHeight.id, metricColor,
                layout, scale, selectedObjectId, cameraPosition, colorTheme,
                houseColorMode
            );

            this.applyParams(visualizationLinkParams);

            this.cityBuilderStore.show = false;
            this.cityBuilderStore.initiateBuildProcess = true;
        }
    }

    public createVisualizationLink(): string {
        return UrlParameterService.createVisualizationLinkForCurrentUrl(document.location.href, this.createCurrentParams());
    }

    public createPlainVisualizationLink(): string {
        let baseUrl = "";
        if (this.config.baseUrl) {
            baseUrl = this.config.baseUrl;
        }

        const baseLocation = baseUrl + "/static/softvis3d/index.html" +
            "?projectKey=" + this.config.projectKey + "&baseUrl=" + baseUrl;

        return UrlParameterService.createVisualizationLinkForCurrentUrl(baseLocation, this.createCurrentParams());
    }

    private createCurrentParams(): Parameters {
        if (!this.sceneStore.cameraPosition) {
            throw new Error("this.sceneStore.cameraPosition is undefined or null on createVisualizationLink");
        }

        let visualizationLinkParams: VisualizationLinkParams =
            new VisualizationLinkParams(this.cityBuilderStore.profile.footprintMetricId,
                this.cityBuilderStore.profile.heightMetricId, this.cityBuilderStore.metricColor,
                this.cityBuilderStore.layout, this.cityBuilderStore.profile.scale,
                this.sceneStore.selectedObjectId, this.sceneStore.cameraPosition, this.sceneStore.colorTheme,
                this.cityBuilderStore.houseColorMode);

        return visualizationLinkParams.getKeyValuePairs();
    }

    private getCameraPosition(params: Parameters): Vector3 | undefined {
        let cameraPosition: Vector3 | undefined;
        if (params.cameraX !== undefined && params.cameraY !== undefined && params.cameraZ !== undefined) {
            cameraPosition = new Vector3(
                parseFloat(params.cameraX),
                parseFloat(params.cameraY),
                parseFloat(params.cameraZ)
            );
        }
        return cameraPosition;
    }

    private applyParams(visualizationLinkParams: VisualizationLinkParams) {
        this.cityBuilderStore.profile = custom;
        this.cityBuilderStore.profile.footprintMetricId = visualizationLinkParams.metricFootprintId;
        this.cityBuilderStore.profile.heightMetricId = visualizationLinkParams.metricHeightId;
        this.cityBuilderStore.metricColor = visualizationLinkParams.metricColor;
        this.cityBuilderStore.profile.scale = visualizationLinkParams.scale;
        this.cityBuilderStore.layout = visualizationLinkParams.layout;
        this.cityBuilderStore.houseColorMode = visualizationLinkParams.houseColorMode;

        this.sceneStore.selectedObjectId = visualizationLinkParams.selectedObjectId;
        this.sceneStore.cameraPosition = visualizationLinkParams.cameraPosition;
        this.sceneStore.colorTheme = visualizationLinkParams.colorTheme;
    }

}