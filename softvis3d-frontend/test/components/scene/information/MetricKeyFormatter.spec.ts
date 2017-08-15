import {expect} from "chai";
import MetricKeyFormatter from "../../../../src/components/scene/information/MetricKeyFormatter";
import Metric from "../../../../src/classes/Metric";
import {MetricType} from "../../../../src/classes/MetricType";

describe("MetricKeyFormatter", () => {

    it("should convert to string on integer", () => {
        let metric = new Metric("", "", "", MetricType.INT);
        let value = 347436;

        let result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.be.eq(value + "");
    });

    it("should convert to date on milliseconds", () => {
        let metric = new Metric("", "", "", MetricType.MILLISEC);
        let value = 1479855600000;

        let result: string = MetricKeyFormatter.formatMeasureValue(metric, value);

        expect(result).to.contain("11");
        expect(result).to.contain("23");
        expect(result).to.contain("2016");
    });

});