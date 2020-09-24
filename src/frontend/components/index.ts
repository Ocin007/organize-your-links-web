
const Components = [

];

for (let component of Components) {
    window.customElements.define(component.TagName(), component);
}