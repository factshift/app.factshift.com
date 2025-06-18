export function center(searchParameters) {
  if (searchParameters.has('center')) {
    let [x, y]                                 = (searchParameters.get('center').split(',').map(n => +n));
    y                                          = y || x;
    window.spwashi.parameters.startPos         = {x, y};
    window.spwashi.parameters.forces.centerPos = {x, y};
  } else {
    let [x, y]                                 = [
      window.spwashi.parameters.width,
      window.spwashi.parameters.height,
    ].map(n => n / 2);
    window.spwashi.parameters.startPos         = {x, y};
    window.spwashi.parameters.forces.centerPos = {x, y};

  }

  return ['center', window.spwashi.parameters.startPos];
}