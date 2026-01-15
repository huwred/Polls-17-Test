import { UmbElementMixin } 
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, html, customElement } 
    from "@umbraco-cms/backoffice/external/lit";

@customElement('polls-workspace-root')
export class PollsWorkspaceElement extends
    UmbElementMixin(LitElement) {

    render() {
        return html`
            <umb-workspace-editor 
                headline="MediaWiz Polls"
                alias="polls.Workspace"
                .enforceNoFooter=${true}>

            </umb-workspace-editor>
        `
    }

};


export default PollsWorkspaceElement;
