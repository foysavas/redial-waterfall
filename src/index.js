const propName = '@@redial-hooks';

export const getHookedComponents = components => (Array.isArray(components) ? components : [components])
  // Filter out falsy components
  .filter(component => component)
  // Get component lifecycle hooks
  .map(component => ({ component, hooks: component[propName] }))
  // Filter out components that haven't been decorated
  .filter(({ hooks }) => hooks)

export const waterfall = (name, components, locals) => getHookedComponents(components)
  // Calculate locals if required, execute hooks and chain promises
  .reduce((promise, { component, hooks }) => {
    const hook = hooks[name];
    if (typeof hook !== 'function') {
      return promise;
    }
    return promise.then(() => {
      return typeof locals === 'function' ?
        hook(locals(component)) :
        hook(locals)
    })
  }, Promise.resolve());

export default waterfall;
