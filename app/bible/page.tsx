"use client"

import { useState, useEffect, useMemo } from "react"
// On ne charge plus statiquement geneseData, on utilisera un import dynamique
import { Search, Book, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReadingCard } from "@/components/reading-card"
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

// Liste complète des livres (ne pas modifier)

export default function Page() {
const allBibleBooks: BibleBook[] = [
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
  { id: "1ch", name: "1 Chroniques", chapters: 29, testament: "AT" },
  { id: "2ch", name: "2 Chroniques", chapters: 36, testament: "AT" },
  { id: "esd", name: "Esdras", chapters: 10, testament: "AT" },
  { id: "ne", name: "Néhémie", chapters: 13, testament: "AT" },
  { id: "tb", name: "Tobie", chapters: 14, testament: "AT" },
  { id: "jdt", name: "Judith", chapters: 16, testament: "AT" },
  { id: "es", name: "Esther", chapters: 16, testament: "AT" },
  { id: "job", name: "Job", chapters: 42, testament: "AT" },
  { id: "ps", name: "Psaumes", chapters: 150, testament: "AT" },
  { id: "pr", name: "Proverbes", chapters: 31, testament: "AT" },
  { id: "ec", name: "Ecclésiaste", chapters: 12, testament: "AT" },
  { id: "ct", name: "Cantique des Cantiques", chapters: 8, testament: "AT" },
  { id: "sag", name: "Sagesse", chapters: 19, testament: "AT" },
  { id: "sir", name: "Siracide", chapters: 51, testament: "AT" },
  { id: "is", name: "Isaïe", chapters: 66, testament: "AT" },
  { id: "jr", name: "Jérémie", chapters: 52, testament: "AT" },
  { id: "lm", name: "Lamentations", chapters: 5, testament: "AT" },
  { id: "ba", name: "Baruch", chapters: 6, testament: "AT" },
  { id: "ez", name: "Ézéchiel", chapters: 48, testament: "AT" },
  { id: "dn", name: "Daniel", chapters: 14, testament: "AT" },
  { id: "os", name: "Osée", chapters: 14, testament: "AT" },
  { id: "jl", name: "Joël", chapters: 4, testament: "AT" },
  { id: "am", name: "Amos", chapters: 9, testament: "AT" },
  { id: "ab", name: "Abdias", chapters: 1, testament: "AT" },
  { id: "jon", name: "Jonas", chapters: 4, testament: "AT" },
  { id: "mi", name: "Michée", chapters: 7, testament: "AT" },
  { id: "na", name: "Nahum", chapters: 3, testament: "AT" },
  { id: "ha", name: "Habacuc", chapters: 3, testament: "AT" },
  { id: "so", name: "Sophonie", chapters: 3, testament: "AT" },
  { id: "ag", name: "Aggée", chapters: 2, testament: "AT" },
  { id: "za", name: "Zacharie", chapters: 14, testament: "AT" },
  { id: "ml", name: "Malachie", chapters: 3, testament: "AT" },
  { id: "1m", name: "1 Maccabées", chapters: 16, testament: "AT" },
  { id: "2m", name: "2 Maccabées", chapters: 15, testament: "AT" },
  // Nouveau Testament (inchangé)
  // ... (ajoutez tous les autres livres ici)
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
  { id: "1jn", name: "1 Jean", chapters: 5, testament: "NT" },
  { id: "2jn", name: "2 Jean", chapters: 1, testament: "NT" },
  { id: "3jn", name: "3 Jean", chapters: 1, testament: "NT" },
  { id: "jude", name: "Jude", chapters: 1, testament: "NT" },
  { id: "ap", name: "Apocalypse", chapters: 22, testament: "NT" },
]

  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [chapterContent, setChapterContent] = useState<string>("")
  const [chapterVerses, setChapterVerses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  // Liste dynamique des fichiers JSON présents dans /public/bible (générée côté client)
  const [availableFiles, setAvailableFiles] = useState<string[]>([])
  useEffect(() => {
    // On ne peut pas lister les fichiers côté client, donc on hardcode la liste générée côté serveur (voir scripts ou build)
    setAvailableFiles([
      "Genesis.json","Exodus.json","Leviticus.json","Numbers.json","Deuteronomy.json","Joshua.json","Judges.json","Ruth.json","I_Samuel.json","II_Samuel.json","I_Kings.json","II_Kings.json","I_Chronicles.json","II_Chronicles.json","Ezra.json","Nehemiah.json","Tobit.json","Judith.json","Esther.json","Job.json","Psalms.json","Proverbs.json","Ecclesiastes.json","Song_of_Solomon.json","Wisdom.json","Sirach.json","Isaiah.json","Jeremiah.json","Lamentations.json","Baruch.json","Ezekiel.json","Daniel.json","Hosea.json","Joel.json","Amos.json","Obadiah.json","Jonah.json","Micah.json","Nahum.json","Habakkuk.json","Zephaniah.json","Haggai.json","Zechariah.json","Malachi.json","Matthew.json","Mark.json","Luke.json","John.json","Acts.json","Romans.json","I_Corinthians.json","II_Corinthians.json","Galatians.json","Ephesians.json","Philippians.json","Colossians.json","I_Thessalonians.json","II_Thessalonians.json","I_Timothy.json","II_Timothy.json","Titus.json","Philemon.json","Hebrews.json","James.json","I_Peter.json","II_Peter.json","I_John.json","II_John.json","III_John.json","Jude.json","Revelation_of_John.json","I_Maccabees.json","II_Maccabees.json"
    ])
  }, [])
  // Mapping complet pour tous les livres, y compris deutérocanoniques
  const fileMap: { [key: string]: string } = {
    gn: "Genesis.json",
    ex: "Exodus.json",
    lv: "Leviticus.json",
    nb: "Numbers.json",
    dt: "Deuteronomy.json",
    jos: "Joshua.json",
    jg: "Judges.json",
    rt: "Ruth.json",
  "1s": "I_Samuel.json",
  "2s": "II_Samuel.json",
  "1r": "I_Kings.json",
  "2r": "II_Kings.json",
  "1ch": "I_Chronicles.json",
  "2ch": "II_Chronicles.json",
    ezr: "Ezra.json",
    ne: "Nehemiah.json",
    tb: "Tobit.json",
    jdt: "Judith.json",
    es: "Esther.json",
    job: "Job.json",
    ps: "Psalms.json",
    pr: "Proverbs.json",
    ec: "Ecclesiastes.json",
    ct: "Song_of_Solomon.json",
    sag: "Wisdom.json",
    sir: "Sirach.json",
    is: "Isaiah.json",
    jr: "Jeremiah.json",
    lm: "Lamentations.json",
    ba: "Baruch.json",
    ez: "Ezekiel.json",
    dn: "Daniel.json",
    os: "Hosea.json",
    jl: "Joel.json",
    am: "Amos.json",
    ab: "Obadiah.json",
    jon: "Jonah.json",
    mi: "Micah.json",
    na: "Nahum.json",
    ha: "Habakkuk.json",
    so: "Zephaniah.json",
    ag: "Haggai.json",
    za: "Zechariah.json",
    ml: "Malachi.json",
    mt: "Matthew.json",
    mc: "Mark.json",
    lc: "Luke.json",
    jn: "John.json",
    ac: "Acts.json",
    rm: "Romans.json",
  "1co": "I_Corinthians.json",
  "2co": "II_Corinthians.json",
    ga: "Galatians.json",
    ep: "Ephesians.json",
    ph: "Philippians.json",
    col: "Colossians.json",
  "1th": "I_Thessalonians.json",
  "2th": "II_Thessalonians.json",
  "1tm": "I_Timothy.json",
  "2tm": "II_Timothy.json",
    tt: "Titus.json",
    phm: "Philemon.json",
    he: "Hebrews.json",
    jc: "James.json",
  "1p": "I_Peter.json",
  "2p": "II_Peter.json",
  "1jn": "I_John.json",
  "2jn": "II_John.json",
  "3jn": "III_John.json",
    jude: "Jude.json",
    ap: "Revelation_of_John.json",
  "1m": "I_Maccabees.json",
  "2m": "II_Maccabees.json",
  }
  const bibleBooks = useMemo(() => {
    return allBibleBooks.filter(book => {
      const file = fileMap[book.id]
      return file && availableFiles.includes(file)
    })
  }, [availableFiles])

  const fetchChapterContent = async (bookId: string, chapter: number) => {
    setLoading(true)
    try {
      let data: any = null

      // Génère le nom de fichier à partir du mapping complet
      const book = bibleBooks.find((b) => b.id === bookId)
      let fileName = ""
      if (book) {
        fileName = fileMap[book.id]?.replace(/\.json$/, "") || ""
      }
      if (fileName) {
        const response = await fetch(`/bible/${fileName}.json`)
        if (response.ok) {
          data = await response.json()
        }
      }

      if (data && data.chapters) {
        // Find the requested chapter
        const chapterData = data.chapters.find((c: any) => c.chapter === chapter)
        if (chapterData && chapterData.verses && chapterData.verses.length > 0) {
          setChapterVerses(chapterData.verses)
          setChapterContent("")
        } else {
          setChapterContent(`<div class="text-center py-8"><p class="text-muted-foreground">Aucun contenu pour ce chapitre.</p></div>`)
          setChapterVerses([])
        }
      } else {
        // Fallback pour livre non disponible ou vide
        setChapterContent(`<div class="text-center py-8"><p class="text-muted-foreground">Aucun contenu pour ce livre.</p></div>`)
        setChapterVerses([])
      }
    } catch (error) {
      console.error("Error loading chapter:", error)
      setChapterContent(generateDemoContent(bookId, chapter))
      setChapterVerses([])
    } finally {
      setLoading(false)
    }
  }

  const generateDemoContent = (bookId: string, chapter: number) => {
    const book = bibleBooks.find((b) => b.id === bookId)
    if (!book) return "Livre non trouvé"
    return `<div class="text-center py-8">
      <Book className="h-12 w-12 text-liturgical-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Contenu de ${book.name} ${chapter} non trouvé dans la Bible de Jérusalem.</p>
      <p class="text-sm text-muted-foreground mt-2">Merci de signaler ce bug ou d'essayer un autre chapitre.</p>
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
          text: "Car Dieu a tellement aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne se perde pas, mais obtienne la vie éternelle.",
        },
        {
          book: "Matthieu",
          chapter: 5,
          verse: 14,
          text: "Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée.",
        },
        { book: "1 Jean", chapter: 4, verse: 8, text: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour." },
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
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6 animate-slide-in-right">
        <h1 className="text-2xl sm:text-3xl font-bold text-liturgical-primary mb-2">Sainte Bible</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Parole de Dieu pour nourrir votre foi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Panneau de navigation */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4 animate-slide-in-left">
          {/* Recherche */}
          <Card className="liturgical-card hover-lift">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-liturgical-primary text-base sm:text-lg">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Rechercher
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <Input
                  placeholder="Rechercher dans la Bible..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchBible(searchQuery)}
                  className="text-sm sm:text-base"
                />
                <Button
                  onClick={() => searchBible(searchQuery)}
                  className="w-full bg-liturgical-primary hover:bg-liturgical-secondary text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sélection de livre */}
          <Card className="liturgical-card hover-lift">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-liturgical-primary text-base sm:text-lg">
                <Book className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Livres de la Bible
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-liturgical-text mb-2">Ancien Testament</h4>
                  <div className="grid grid-cols-1 gap-1 max-h-32 sm:max-h-40 overflow-y-auto">
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
                          className="justify-start text-xs hover-lift h-8 sm:h-9"
                        >
                          <span className="truncate">{book.name}</span>
                        </Button>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-liturgical-text mb-2">Nouveau Testament</h4>
                  <div className="grid grid-cols-1 gap-1 max-h-32 sm:max-h-40 overflow-y-auto">
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
                          className="justify-start text-xs hover-lift h-8 sm:h-9"
                        >
                          <span className="truncate">{book.name}</span>
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
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-liturgical-primary text-base sm:text-lg">
                  <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Mes signets
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-liturgical-bg rounded">
                      <span className="text-xs sm:text-sm text-liturgical-text truncate flex-1 mr-2">{bookmark}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(bookmark)}
                        className="h-6 w-6 flex-shrink-0"
                      >
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
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 animate-slide-in-right">
          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <Card className="liturgical-card hover-lift">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-liturgical-primary text-base sm:text-lg">Résultats de recherche</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 bg-liturgical-bg rounded-lg border-l-4 border-liturgical-primary"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary text-xs">
                          {result.book} {result.chapter}:{result.verse}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(`${result.book} ${result.chapter}:${result.verse}`)}
                          className="h-6 w-6 flex-shrink-0"
                        >
                          <Star
                            className={`h-3 w-3 ${bookmarks.includes(`${result.book} ${result.chapter}:${result.verse}`) ? "fill-current text-liturgical-primary" : ""}`}
                          />
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">{result.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedBook && chapterVerses.length > 0 && (
            <Card className="liturgical-card hover-lift">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between text-liturgical-primary text-base sm:text-lg gap-2">
                  <span className="truncate">
                    {selectedBook.name} - Chapitre {selectedChapter}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                      disabled={selectedChapter <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Select
                      value={selectedChapter.toString()}
                      onValueChange={(value) => setSelectedChapter(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-16 sm:w-20 h-8 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                          <SelectItem key={ch} value={ch.toString()}>
                            {ch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChapter(Math.min(selectedBook.chapters, selectedChapter + 1))}
                      disabled={selectedChapter >= selectedBook.chapters}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-0">
                  {chapterVerses.map((verse, index) => (
                    <div
                      key={index}
                      className="flex items-start group hover:bg-liturgical-bg/30 transition-colors duration-200"
                    >
                      <span className="text-xs font-bold text-liturgical-primary w-8 flex-shrink-0 text-left pt-1">
                        {verse.verse}
                      </span>
                      <div className="flex-1 py-1">
                        <p className="text-sm leading-relaxed text-justify">{verse.text}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(`${selectedBook.name} ${selectedChapter}:${verse.verse}`)}
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 float-right -mt-6"
                        >
                          <Star
                            className={`h-3 w-3 ${bookmarks.includes(`${selectedBook.name} ${selectedChapter}:${verse.verse}`) ? "fill-current text-liturgical-primary" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lecteur de chapitre + barre de navigation lectures */}
          {selectedBook && chapterVerses.length === 0 && chapterContent && (
            <>
              {/* Barre de navigation lectures - scroll horizontal améliorée */}
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-liturgical-primary/40 scrollbar-track-transparent mb-4 px-2" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex flex-row gap-2 min-w-[600px]">
                  {[
                    { type: "lecture_1", label: "Première lecture" },
                    { type: "psaume", label: "Psaume" },
                    { type: "lecture_2", label: "Deuxième lecture" },
                    { type: "evangile", label: "Évangile" },
                  ].map((item, idx) => {
                    // Lecture active = nette, autres = floues (pour la démo, lecture_1 est active)
                    const isActive = idx === 0
                    return (
                      <button
                        key={item.type}
                        className={`min-w-[140px] px-4 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap ${isActive ? "bg-liturgical-primary text-white shadow-lg" : "bg-liturgical-primary/10 text-liturgical-primary opacity-60"}`}
                        style={{ opacity: isActive ? 1 : 0.6 }}
                        onClick={() => {
                          const el = document.getElementById(item.type)
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* Slider horizontal des lectures avec titres séparés et espacement réduit */}
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-liturgical-primary/40 scrollbar-track-transparent pb-2">
                <div className="flex flex-row gap-3 min-w-[600px] px-2">
                  {(() => {
                    const lectureTypes = [
                      { type: "lecture_1", label: "Première lecture" },
                      { type: "psaume", label: "Psaume" },
                      { type: "lecture_2", label: "Deuxième lecture" },
                      { type: "evangile", label: "Évangile" },
                    ];
                    const lecturesData = lectureTypes.map(({ type, label }) => {
                      const lecture = chapterVerses.find((v: any) => v && v.type === type && v.reference && v.text)
                      return lecture ? { ...lecture, label, type } : null
                    }).filter(Boolean);
                    if (lecturesData.length === 0) {
                      return (
                        <div className="text-center w-full text-muted-foreground">Aucune lecture trouvée pour ce chapitre.</div>
                      );
                    }
                    return lecturesData.map((lecture: any, idx: number) => (
                      <div key={lecture.type || idx} className="flex-shrink-0 w-[340px]">
                        {/* Titre hors de la box */}
                        <div className="text-base font-semibold text-liturgical-primary mb-1 text-center">{lecture.label}</div>
                        {lecture.reference && lecture.text ? (
                          <ReadingCard
                            reading={lecture}
                            type={lecture.type as any}
                            className="mb-0"
                          />
                        ) : (
                          <div className="text-center text-xs text-muted-foreground">Lecture incomplète</div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <Card className="liturgical-card hover-lift">
                <CardContent className="p-6">
                  <div dangerouslySetInnerHTML={{ __html: chapterContent }} />
                </CardContent>
              </Card>
            </>
          )}

          {/* Message d'accueil */}
          {!selectedBook && searchResults.length === 0 && (
            <Card className="liturgical-card hover-lift">
              <CardContent className="p-6 sm:p-8 text-center">
                <Book className="h-12 w-12 sm:h-16 sm:w-16 text-liturgical-primary mx-auto mb-4 animate-float" />
                <h3 className="text-lg sm:text-xl font-semibold text-liturgical-primary mb-2">
                  Bienvenue dans la Bible
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Choisissez un livre dans le panneau de gauche ou utilisez la recherche pour explorer la Parole de
                  Dieu.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary text-xs">
                    73 livres
                  </Badge>
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary text-xs">
                    1189 chapitres
                  </Badge>
                  <Badge variant="secondary" className="bg-liturgical-primary/20 text-liturgical-primary text-xs">
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
