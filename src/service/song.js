import { get } from './base'

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
