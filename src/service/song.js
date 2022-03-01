import { get } from './base'

// 返回带有歌曲播放 url 的数组
export function processSongs(songs) {
  // 歌曲列表为空，直接返回
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  // 参数为所有歌曲的 mid 的数组
  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    // 返回一个对象 key 是 mid，value 是 url
    const map = result.map
    // 返回歌曲列表，向其中添加 url
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      // 过滤有效的 url
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

// 同一首歌的 song 对象可能不一样，使用 mid 构建一个 map
// 当对象不一样时也能通过缓存找到相同 mid 的歌词
const lyricMap = {}

// 返回歌曲的歌词
export function getLyric(song) {
  // 有缓存则不发送请求
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid

  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(song.lyric)
  }

  return get('/api/getLyric', { mid })
    .then((result) => {
      const lyric = result ? result.lyric : '[00:00:00]该歌曲暂无歌词'
      lyricMap[mid] = lyric
      return lyric
    })
}
