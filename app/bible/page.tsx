"use client"

import { useState, useEffect } from "react"
import { Search, Book, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BibleBook {
  id: string
  name: string
  chapters: number
  testament: "AT" | "NT"
}

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

const bibleBooks: BibleBook[] = [
  // Ancien Testament
  { id: "gn", name: "Genèse", chapters: 50, testament: "AT" },
  { id: "ex", name: "Exode", chapters: 40, testament: "AT" },
  { id: "lv", name: "Lévitique", chapters: 27, testament: "AT" },
  { id: "nb", name: "Nombres", chapters: 36, testament: "AT" },
  { id: "dt", name: "Deutéronome", chapters: 34, testament: "AT" },
  { id: "jos", name: "Josué", chapters: 24, testament: "AT" },
  { id: "jg", name: "Juges", chapters: 21, testament: "AT" },
  { id: "rt", name: "Ruth", chapters: 4, testament: "AT" },
  { id: "1s", name: "1 Samuel", chapters: 31, testament: "AT" },
  { id: "2s", name: "2 Samuel", chapters: 24, testament: "AT" },
  { id: "1r", name: "1 Rois", chapters: 22, testament: "AT" },
  { id: "2r", name: "2 Rois", chapters: 25, testament: "AT" },
  { id: "ps", name: "Psaumes", chapters: 150, testament: "AT" },
  { id: "pr", name: "Proverbes", chapters: 31, testament: "AT" },
  { id: "is", name: "Isaïe", chapters: 66, testament: "AT" },
  { id: "jr", name: "Jérémie", chapters: 52, testament: "AT" },
  { id: "ez", name: "Ézéchiel", chapters: 48, testament: "AT" },
  { id: "dn", name: "Daniel", chapters: 14, testament: "AT" },

  // Nouveau Testament
  { id: "mt", name: "Matthieu", chapters: 28, testament: "NT" },
  { id: "mc", name: "Marc", chapters: 16, testament: "NT" },
  { id: "lc", name: "Luc", chapters: 24, testament: "NT" },
  { id: "jn", name: "Jean", chapters: 21, testament: "NT" },
  { id: "ac", name: "Actes", chapters: 28, testament: "NT" },
  { id: "rm", name: "Romains", chapters: 16, testament: "NT" },
  { id: "1co", name: "1 Corinthiens", chapters: 16, testament: "NT" },
  { id: "2co", name: "2 Corinthiens", chapters: 13, testament: "NT" },
  { id: "ga", name: "Galates", chapters: 6, testament: "NT" },
  { id: "ep", name: "Éphésiens", chapters: 6, testament: "NT" },
  { id: "ph", name: "Philippiens", chapters: 4, testament: "NT" },
  { id: "col", name: "Colossiens", chapters: 4, testament: "NT" },
  { id: "1th", name: "1 Thessaloniciens", chapters: 5, testament: "NT" },
  { id: "2th", name: "2 Thessaloniciens", chapters: 3, testament: "NT" },
  { id: "1tm", name: "1 Timothée", chapters: 6, testament: "NT" },
  { id: "2tm", name: "2 Timothée", chapters: 4, testament: "NT" },
  { id: "tt", name: "Tite", chapters: 3, testament: "NT" },
  { id: "phm", name: "Philémon", chapters: 1, testament: "NT" },
  { id: "he", name: "Hébreux", chapters: 13, testament: "NT" },
  { id: "jc", name: "Jacques", chapters: 5, testament: "NT" },
  { id: "1p", name: "1 Pierre", chapters: 5, testament: "NT" },
  { id: "2p", name: "2 Pierre", chapters: 3, testament: "NT" },
  { id: "1jn", name: "1 Jean", chapters: 5, testament: "NT" },
  { id: "2jn", name: "2 Jean", chapters: 1, testament: "NT" },
  { id: "3jn", name: "3 Jean", chapters: 1, testament: "NT" },
  { id: "jude", name: "Jude", chapters: 1, testament: "NT" },
  { id: "ap", name: "Apocalypse", chapters: 22, testament: "NT" },
]

export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [chapterContent, setChapterContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const fetchChapterContent = async (bookId: string, chapter: number) => {
    setLoading(true)
    try {
      // Appel à l'API interne Next.js
      const res = await fetch(`/api/bible/${bookId}/${chapter}`)
      if (res.ok) {
        const data = await res.json()
        if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
          setChapterContent(
            `<div class="space-y-2">` +
              data.verses.map((v: any) => `<p><span class="font-bold text-liturgical-primary">${v.verse}</span> ${v.text}</p>`).join("") +
            `</div>`
          )
        } else if (data.content) {
          setChapterContent(`<div class="prose">${data.content}</div>`)
        } else {
          setChapterContent("Contenu non disponible")
        }
      } else {
        setChapterContent("Contenu non disponible")
      }
    } catch (error) {
      setChapterContent("Erreur lors du chargement du chapitre")
    } finally {
      setLoading(false)
    }
  }

  const generateDemoContent = (bookId: string, chapter: number) => {
    const book = bibleBooks.find((b) => b.id === bookId)
    if (!book) return "Livre non trouvé"

    if (bookId === "jn" && chapter === 1) {
      return `<div class="space-y-4">
        <p><span class="font-bold text-liturgical-primary">1</span> Au commencement était le Verbe, et le Verbe était auprès de Dieu, et le Verbe était Dieu.</p>
        <p><span class="font-bold text-liturgical-primary">2</span> Il était au commencement auprès de Dieu.</p>
        <p><span class="font-bold text-liturgical-primary">3</span> C'est par lui que tout est venu à l'existence, et rien de ce qui s'est fait ne s'est fait sans lui.</p>
        <p><span class="font-bold text-liturgical-primary">4</span> En lui était la vie, et la vie était la lumière des hommes ;</p>
        <p><span class="font-bold text-liturgical-primary">5</span> la lumière brille dans les ténèbres, et les ténèbres ne l'ont pas arrêtée.</p>
        <p><span class="font-bold text-liturgical-primary">14</span> Et le Verbe s'est fait chair, il a habité parmi nous, et nous avons vu sa gloire, la gloire qu'il tient de son Père comme Fils unique, plein de grâce et de vérité.</p>
      </div>`
    }

    if (bookId === "ps" && chapter === 23) {
      return `<div class="space-y-4">
        <p><span class="font-bold text-liturgical-primary">1</span> Le Seigneur est mon berger : je ne manque de rien.</p>
        <p><span class="font-bold text-liturgical-primary">2</span> Sur des prés d'herbe fraîche, il me fait reposer. Il me mène vers les eaux tranquilles</p>
        <p><span class="font-bold text-liturgical-primary">3</span> et me fait revivre ; il me conduit par le juste chemin pour l'honneur de son nom.</p>
        <p><span class="font-bold text-liturgical-primary">4</span> Si je traverse les ravins de la mort, je ne crains aucun mal, car tu es avec moi : ton bâton me guide et me rassure.</p>
        <p><span class="font-bold text-liturgical-primary">6</span> Grâce et bonheur m'accompagnent tous les jours de ma vie ; j'habiterai la maison du Seigneur pour la durée de mes jours.</p>
      </div>`
    }

    return `<div class="text-center py-8">
      <Book className="h-12 w-12 text-liturgical-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Contenu de ${book.name} ${chapter} en cours de chargement...</p>
      <p class="text-sm text-muted-foreground mt-2">Intégration complète avec l'API AELF en développement.</p>
    </div>`
  }

  const searchBible = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      // Simulation de recherche - dans une vraie app, ceci utiliserait l'API AELF
      const mockResults: BibleVerse[] = [
        {
          book: "Jean",
          chapter: 3,
          verse: 16,
          text: "Car Dieu a tellement aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne se perde pas, mais obtienne la vie éternelle."
        },
        {
          book: "Matthieu",
          chapter: 5,
          verse: 14,
          text: "Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée."
        },
        {
          book: "1 Jean",
          chapter: 4,
          verse: 8,
          text: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour."
        }
      ].filter((verse) => verse.text.toLowerCase().includes(query.toLowerCase()))

      setSearchResults(mockResults)
    } catch (error) {
      console.error("Erreur de recherche:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = (reference: string) => {
    const newBookmarks = bookmarks.includes(reference)
      ? bookmarks.filter((b) => b !== reference)
      : [...bookmarks, reference]

    setBookmarks(newBookmarks)
    localStorage.setItem("bible-bookmarks", JSON.stringify(newBookmarks))
  }

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bible-bookmarks")
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  useEffect(() => {
    if (selectedBook) {
      fetchChapterContent(selectedBook.id, selectedChapter)
    }
  }, [selectedBook, selectedChapter])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 animate-slide-in-right">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Sainte Bible</h1>
        <p className="text-muted-foreground">Parole de Dieu pour nourrir votre foi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de navigation */}
        <div className="lg:col-span-1 space-y-4 animate-slide-in-left">
          {/* Recherche */}
          <Card className="liturgical-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-liturgical-primary">
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Rechercher dans la Bible..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchBible(searchQuery)}
                />
                <Button
                  onClick={() => searchBible(searchQuery)}
                  className="w-full bg-liturgical-primary hover:bg-liturgical-secondary"
                  disabled={loading}
                >
                  {loading ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sélection de livre */}
          <Card className="liturgical-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-liturgical-primary">
                <Book className="h-5 w-5 mr-2" />
                Livres de la Bible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-liturgical-text mb-2">Ancien Testament</h4>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                    {bibleBooks
                      .filter((book) => book.testament === "AT")
                      .map((book) => (
                        <Button
                          key={book.id}
                          variant={selectedBook?.id === book.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book)
                            setSelectedChapter(1)
                          }}
                          className="justify-start text-xs hover-lift"
                        >
                          {book.name}
                        </Button>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-liturgical-text mb-2">Nouveau Testament</h4>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                    {bibleBooks
                      .filter((book) => book.testament === "NT")
                      .map((book) => (
                        <Button
                          key={book.id}
                          variant={selectedBook?.id === book.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book)
                            setSelectedChapter(1)
                          }}
                          className="justify-start text-xs hover-lift"
                        >
                          {book.name}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signets */}
          {bookmarks.length > 0 && (
            <Card className="liturgical-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center text-liturgical-primary">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Mes signets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-liturgical-bg rounded">
                      <span className="text-sm text-liturgical-text">{bookmark}</span>
                      <Button variant="ghost" size="icon" onClick={() => toggleBookmark(bookmark)} className="h-6 w-6">
                        <Star className={`h-3 w-3 fill-current text-liturgical-primary`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-4 animate-slide-in-right">
          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <Card className="liturgical-card hover-lift">
              <CardHeader>
                <CardTitle className="text-liturgical-primary">Résultats de recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 bg-liturgical-bg rounded-lg border-l-4 border-liturgical-primary">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary">
                          {result.book} {result.chapter}:{result.verse}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(`${result.book} ${result.chapter}:${result.verse}`)}
                          className="h-6 w-6"
                        >
                          <Star
                            className={`h-3 w-3 ${bookmarks.includes(`${result.book} ${result.chapter}:${result.verse}`) ? "fill-current text-liturgical-primary" : ""}`}
                          />
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed">{result.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lecteur de chapitre */}
          {selectedBook && (
            <Card className="liturgical-card hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-liturgical-primary">
                    {selectedBook.name} - Chapitre {selectedChapter}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedChapter.toString()}
                      onValueChange={(value) => setSelectedChapter(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                          <SelectItem key={chapter} value={chapter.toString()}>
                            {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(`${selectedBook.name} ${selectedChapter}`)}
                      className="hover-glow"
                    >
                      <Star
                        className={`h-4 w-4 ${bookmarks.includes(`${selectedBook.name} ${selectedChapter}`) ? "fill-current text-liturgical-primary" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-liturgical-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement du chapitre...</p>
                  </div>
                ) : (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: chapterContent }}
                  />
                )}

                {/* Navigation entre chapitres */}
                <div className="flex justify-between mt-6 pt-4 border-t border-liturgical-primary/20">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                    disabled={selectedChapter === 1}
                    className="hover-lift"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Chapitre précédent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChapter(Math.min(selectedBook.chapters, selectedChapter + 1))}
                    disabled={selectedChapter === selectedBook.chapters}
                    className="hover-lift"
                  >
                    Chapitre suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message d'accueil */}
          {!selectedBook && searchResults.length === 0 && (
            <Card className="liturgical-card hover-lift">
              <CardContent className="p-8 text-center">
                <Book className="h-16 w-16 text-liturgical-primary mx-auto mb-4 animate-float" />
                <h3 className="text-xl font-semibold text-liturgical-primary mb-2">Bienvenue dans la Bible</h3>
                <p className="text-muted-foreground mb-4">
                  Choisissez un livre dans le panneau de gauche ou utilisez la recherche pour explorer la Parole de
                  Dieu.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary">
                    73 livres
                  </Badge>
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary">
                    1189 chapitres
                  </Badge>
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary">
                    31 102 versets
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
