function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Thinkful',
      url_name: 'https://www.thinkful.com',
      url_desc: 'Think outside the classroom',
      rating: 5,
    },
    {
      id: 2,
      title: 'Google',
      url_name: 'https://www.google.com',
      url_desc: 'Where we find everything else',
      rating: 4,
    },
    {
      id: 3,
      title: 'MDN',
      url_name: 'https://developer.mozilla.org',
      url_desc: 'The only place to find web documentation',
      rating: 5,
    },
  ]
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url_name: 'https://www.hackers.com',
    url_desc: `Bad image <img src="https://url_name.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1,
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    url_desc: `Bad image <img src="https://url_name.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark,
}