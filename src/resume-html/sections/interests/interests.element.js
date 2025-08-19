import './interests.css';

const DEVELOPER_BOOKS_INTEREST_NAME = 'Developer books I recommend';
const DEVELOPER_BOOKS_LINKS = {
  'Clean Code':
    'https://www.google.com.au/books/edition/Clean_Code/_i6bDeoCQzsC',
  'Pragmatic Programmer':
    'https://www.google.com.au/books/edition/The_Pragmatic_Programmer/5wBQEp6ruIAC',
  'The Art of Unit Testing':
    'https://www.google.com.au/books/edition/The_Art_of_Unit_Testing/tTkzEAAAQBAJ',
  'The Phoenix Project':
    'https://www.google.com.au/books/edition/The_Phoenix_Project/H6x-DwAAQBAJ',
  'The Software Craftsman':
    'https://www.google.com.au/books/edition/The_Software_Craftsman/JxvVBQAAQBAJ',
  'Working effectively with legacy code':
    'https://www.google.com.au/books/edition/Working_Effectively_with_Legacy_Code/fB6s_Z6g0gIC',
};

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
                    ${interest.keywords
                      .sort((a, b) => a.length - b.length)
                      .map(keyword =>
                        this.renderKeyword(interest.name, keyword),
                      )
                      .join('')}
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

  renderKeyword(interestName, keyword) {
    if (interestName === DEVELOPER_BOOKS_INTEREST_NAME) {
      const link = DEVELOPER_BOOKS_LINKS[keyword];
      return `<li><a href="${link}" target="_blank">${keyword}</a></li>`;
    }
    return `<li>${keyword}</li>`;
  }
}

customElements.define('resume-interests', ResumeInterestsElement);
