export const toggleFocalPoint = () => {
  const button               = document.querySelector('#focal-square');
  const wasInactive          = button.dataset.focalStatus !== 'active';
  const nextStatus           = !wasInactive ? 'inactive' : 'active';
  button.disabled            = nextStatus === 'inactive';
  button.dataset.focalStatus = nextStatus;
};