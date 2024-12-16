class ResumeInterestsElement extends HTMLElement {
  connectedCallback() {
    const interests = JSON.parse(this.attributes.interests.value);
    this.innerHTML = `
      ${
        interests.length
          ? `
        <section id="interests">
          <h3>Interests</h3>
          <div class="grid-list">
            ${interests
              .map(
                interest => `
              <div>
                <h4>${interest.name}</h4>
                ${
                  interest.keywords?.length
                    ? `
                  <ul class="tag-list">
                    ${interest.keywords.map(keyword => `<li>${keyword}</li>`).join('')}
                  </ul>
                `
                    : ''
                }
              </div>
            `,
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }`;
  }
}

customElements.define('resume-interests', ResumeInterestsElement);
