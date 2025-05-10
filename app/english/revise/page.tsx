// 'use client'

// import { useEffect, useState } from 'react'
// import { supabaseBrowser as supabase } from '@/lib/supabase/client'

// export default function ReviewPage() {
//   const [cards, setCards] = useState([])

//   useEffect(() => {
//     supabase
//       .from('review_queue')
//       .select('vocab: vocabularies(id,word,meaning), repetition_count,interval_days,easiness_factor,next_review')
//       .lte('next_review', new Date().toISOString())
//       .limit(100)
//       .then(({ data }) =>
//         setCards((data || []).map(r => ({
//           id: r.vocab.id,
//           word: r.vocab.word,
//           meaning: r.vocab.meaning,
//           ...r
//         })))
//       )
//   }, [])

//   const handleAnswer = async (c, known) => {
//     let { repetition_count: n, interval_days: i, easiness_factor: ef, id } = c
//     if (!known) {
//       n = 0; i = 1
//     } else {
//       n += 1
//       if (n === 1) i = 1
//       else if (n === 2) i = 6
//       else i = Math.round(i * ef)
//       ef = Math.max(1.3, ef + 0.1)
//     }
//     const nextReview = new Date(Date.now() + i * 86400000).toISOString()

//     if (n >= 3) {
//       await supabase.from('review_queue').delete().eq('vocab_id', id)
//     } else {
//       await supabase
//         .from('review_queue')
//         .update({ repetition_count: n, interval_days: i, easiness_factor: ef, next_review: nextReview })
//         .eq('vocab_id', id)
//     }
//     setCards(cs => cs.filter(x => x.id !== id))
//   }

//   return (
//     <div>
//       {cards.map(c => (
//         <div key={c.id} className="card">
//           <h3>{c.word}</h3>
//           <p>{c.meaning}</p>
//           <button onClick={() => handleAnswer(c, true)}>Đã biết</button>
//           <button onClick={() => handleAnswer(c, false)}>Chưa biết</button>
//         </div>
//       ))}
//     </div>
//   )
// }
