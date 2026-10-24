/** The input sequences are mathematically proven conditionally convergent. */
export const SERIES = Object.freeze({
  periodic: {name:'Периодический: (1, 1, −2)/n', formula:'aₙ = cₙ/n,  cₙ = (1, 1, −2)', description:'Сходится по Дирихле; сумма модулей расходится.', term:n=>(n%3===0?-2:1)/n},
  harmonic: {name:'Знакочередующийся гармонический', formula:'aₙ = (−1)ⁿ⁺¹/n', description:'Сходится по Лейбницу, но не абсолютно.', term:n=>(n%2?1:-1)/n},
  sqrt: {name:'Медленное убывание: 1/√n', formula:'aₙ = (−1)ⁿ⁺¹/√n', description:'Условно сходится по Лейбницу; медленнее убывают члены.', term:n=>(n%2?1:-1)/Math.sqrt(n)},
  sine: {name:'Ряд Дирихле: sin(n)/n', formula:'aₙ = sin(n)/n', description:'Сходится по Дирихле, но не абсолютно; знаки нерегулярны.', term:n=>Math.sin(n)/n}
});
export function seriesById(id){if(!Object.hasOwn(SERIES,id))throw Error('Неизвестный ряд');return SERIES[id]}
