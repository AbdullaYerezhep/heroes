let allHeroes = []

const sizes = ['10', '20', '50', '100', 'all results']

const select = document.createElement('select')
sizes.forEach(size => {
    const option = document.createElement('option')
    option.textContent = size
    option.value = size
    if (size == '20') {
        option.defaultSelected = 'true'
    }
    select.append(option)
})
document.body.append(select)

select.addEventListener('change', (event) => {
    if (event.target.value == 'all results') {
        createPages()
        showHeroes(getSearched())
        return
    }
    createPages(select.value)
    showHeroes(getSearched(), ...getStartEnd())
})

const showHeroes = (heroes, start = 0, size = allHeroes.length) => {
    if (document.querySelector('table')) {
        document.querySelector('table').remove()
    }
    const table = document.createElement('table')
    const firstRow = `
        <tr>
            <th>Icon</th>
            <th data-path='name'>Name</th>
            <th data-path='biography.fullName'>Full Name</th>
            <th data-path='powerstats.intelligence'>Intelligence</th>
            <th data-path='powerstats.strength'>Strength</th>
            <th data-path='powerstats.speed'>Speed</th>
            <th data-path='powerstats.durability'>Durability</th>
            <th data-path='powerstats.power'>Power</th>
            <th data-path='powerstats.combat'>Combat</th>
            <th data-path='appearance.race'>Race</th>
            <th data-path='appearance.gender'>Gender</th>
            <th data-path='appearance.height'>Height</th>
            <th data-path='appearance.weight'>Weight</th>
            <th data-path='biography.placeOfBirth'>Place Of Birth </th>
            <th data-path='biography.alignment'>Alignement</th>
        </tr>
    `
    table.innerHTML += firstRow
    document.body.append(table)
    heroes.slice(start, size).forEach(hero => {
        const row = `
            <tr>
                <td><img src='${hero.images.xs}'></td>
                <td>${hero.name}</td>
                <td>${hero.biography.fullName}</td>
                <td>${hero.powerstats.intelligence}</td>
                <td>${hero.powerstats.strength}</td>
                <td>${hero.powerstats.speed}</td>
                <td>${hero.powerstats.durability}</td>
                <td>${hero.powerstats.power}</td>
                <td>${hero.powerstats.combat}</td>
                <td>${hero.appearance.race}</td>
                <td>${hero.appearance.gender}</td>
                <td>${hero.appearance.height}</td>
                <td>${hero.appearance.weight}</td>
                <td>${hero.biography.placeOfBirth}</td>
                <td>${hero.biography.alignment}</td>
            </tr>
        `
        table.innerHTML += row
    })
    const fields = document.querySelectorAll('th')
    fields.forEach(field => {
        if (field.textContent != 'Icon') {
            field.addEventListener('click', sortByField)
        }
    })
}

const getStartEnd = () => {
    const pagination = document.querySelector('.pagination')
    return [pagination.value * parseInt(select.value), parseInt(select.value) + pagination.value * parseInt(select.value)]
}

const createPages = (size = allHeroes.length) => {
    if (document.querySelector('.pagination')) {
        document.querySelector('.pagination').remove()
    }
    const pagination = document.createElement('select')
    pagination.classList.add('pagination')
    pagination.addEventListener('change', (event) => {
        showHeroes(getSearched(), ...getStartEnd())
    })
    const pages = Math.ceil(getSearched().length / size)
    for (let index = 0; index < pages; index++) {
        const page = document.createElement('option')
        page.textContent = index + 1
        page.value = index
        pagination.append(page)
    }
    document.body.insertBefore(pagination, document.body.firstChild)
}


const search = document.createElement('input')
search.placeholder = 'Search...'
const getSearched = () => allHeroes.filter(hero => hero.name.toLowerCase().includes(search.value.toLowerCase()))
search.addEventListener('input', (event) => {
    createPages(select.value)
    showHeroes(getSearched(), ...getStartEnd())
})
document.body.insertBefore(search, document.body.firstChild)

const loadData = (data) => {
    allHeroes = data
    allHeroes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    createPages(select.value)
    showHeroes(allHeroes, null, select.value)
}

export const start = () => {
    fetch('https://akabab.github.io/superhero-api/api/all.json')
        .then(response => response.json())
        .then(loadData)
}

let sort = 0

function sortByField(event) {
    const sortField = event.target.dataset.path
    const heroes = getSearched()
    sort++
    if (sort % 2 == 0) {
        heroes.sort((a, b) => {
            const valA = getValFromKey(a, sortField)
            const valB = getValFromKey(b, sortField)

            if (sortField == 'appearance.height' || sortField == 'appearance.weight') {
                let intA = parseFloat(valA[1].split(' ')[0].replace(',',''))
                let intB = parseFloat(valB[1].split(' ')[0].replace(',',''))
                if (intA === 0) {
                    return 1
                }
                if (intB === 0) {
                    return -1
                }
                if (valA[1].split(' ')[1] == 'meters') {
                    intA *= 100
                }
                if (valB[1].split(' ')[1] == 'meters') {
                    intB *= 100
                }
                if (valA[1].split(' ')[1] == 'tons') {
                    intA *= 1000
                }
                if (valB[1].split(' ')[1] == 'tons') {
                    intB *= 1000
                }
                return intA - intB
            }

            if (valA === '' || valA === null || valA === 0 || valA === '-') {
                return 1
            }
            if (valB === '' || valB === null || valB === 0 || valB === '-') {
                return -1
            }

            if (typeof valA == 'string' && typeof valB == 'string') {
                return valA.toLowerCase().localeCompare(valB.toLowerCase())
            }
            return valA - valB
        }
        )
    } else {
        heroes.sort((a, b) => {
            const valA = getValFromKey(a, sortField)
            const valB = getValFromKey(b, sortField)

            if (sortField == 'appearance.height' || sortField == 'appearance.weight') {
                let intA = parseFloat(valA[1].split(' ')[0].replace(',',''))
                let intB = parseFloat(valB[1].split(' ')[0].replace(',',''))
                if (intA === 0) {
                    return 1
                }
                if (intB === 0) {
                    return -1
                }
                if (valA[1].split(' ')[1] == 'meters') {
                    intA *= 100
                }
                if (valB[1].split(' ')[1] == 'meters') {
                    intB *= 100
                }
                if (valA[1].split(' ')[1] == 'tons') {
                    intA *= 1000
                }
                if (valB[1].split(' ')[1] == 'tons') {
                    intB *= 1000
                }
                return intB - intA
            }

            if (valA === '' || valA === null || valA === 0 || valA === '-') {
                return 1
            }
            if (valB === '' || valB === null || valB === 0 || valB === '-') {
                return -1
            }

            if (typeof valA == 'string' && typeof valB == 'string') {
                return valB.toLowerCase().localeCompare(valA.toLowerCase())
            }
            return valB - valA
        }
        )
    }
    showHeroes(heroes, ...getStartEnd())
}

const getValFromKey = (src, path) => {
    let key = ''
    for (let i = 0; i < path.length; i++) {
        if (path[i] == '.') {
            if (typeof src[key] == 'undefined') {
                return undefined
            }
            src = src[key]
            key = ''
        } else {
            key += path[i]
        }
        if (i == path.length - 1) {
            return src[key]
        }
    }
}