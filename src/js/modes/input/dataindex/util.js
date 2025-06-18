const dataindexPrefix = 'spwashi-datum-';

export function getDataIndexForNumber(index) {
  return dataindexPrefix + (index % 13);
}

export function setDocumentDataIndex(index) {
  document.body.dataset.dataindex = index;
  window.spwashi.onDataIndexChange(index);

}

export function getDocumentDataIndex() {
  return parseInt((document.body.dataset.dataindex || '0').split('-').reverse()[0]);

}
