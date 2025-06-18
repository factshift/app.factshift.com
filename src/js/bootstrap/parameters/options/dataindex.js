import {getDataIndexForNumber, setDocumentDataIndex} from "../../../input-modes/dataindex/util";

export function dataindex(searchParameters) {
  if (searchParameters.has('dataindex')) {
    window.spwashi.parameters.dataIndex = +searchParameters.get('dataindex');
    setDocumentDataIndex(getDataIndexForNumber(window.spwashi.parameters.dataIndex));
  }
  return ['dataindex', window.spwashi.parameters.dataIndex];
}