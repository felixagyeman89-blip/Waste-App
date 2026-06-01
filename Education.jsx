
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { EducationalContent } from "@/entities/EducationalContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  BookOpen, Search, Lightbulb, Video, FileText, Headphones,
  ArrowLeft, Star, ChevronRight, Tags, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "Learn & Recycle",
    subtitle: "Knowledge to help our community thrive.",
    backToDashboard: "Back to Dashboard",
    searchPlaceholder: "Search for topics...",
    featuredArticles: "Featured Articles",
    allResources: "All Resources",
    all: "All",
    wasteSeparation: "Waste Separation",
    recycling: "Recycling",
    composting: "Composting",
    hazardousWaste: "Hazardous Waste",
    environmentalImpact: "Environmental Impact",
    readMore: "Read More",
    by: "By Kwadaso Waste Mgmt",
    article: "Article",
    video: "Video",
    infographic: "Infographic",
    audio: "Audio",
    tags: "Tags",
    noResults: "No articles found matching your criteria."
  },
  tw: {
    title: "Sua na Yɛ Bio",
    subtitle: "Nimdeɛ a ɛbɛboa yɛn mpɔtam ma atu mpɔn.",
    backToDashboard: "San Kɔ Dashboard",
    searchPlaceholder: "Hwehwɛ nsɛmti...",
    featuredArticles: "Nsɛm a Wɔayi Adi",
    allResources: "Nneɛma Nyinaa",
    all: "Nyinaa",
    wasteSeparation: "Nwura Bɛn Mu",
    recycling: "Nneɛma a Yɛyɛ Bio",
    composting: "Amoa Yɛ",
    hazardousWaste: "Nwura Bɔne",
    environmentalImpact: "Abɔdeɛ So Nsunsuansoɔ",
    readMore: "Kenkan Pii",
    by: "Ofi Kwadaso Nwura Sohwɛ",
    article: "Asɛm",
    video: "Video",
    infographic: "Mfonini a ɛkyerɛkyerɛ mu",
    audio: "Lanne",
    tags: "Tags",
    noResults: "Yɛnhunuu nsɛm biara a ɛne wo hwehwɛ no hyia."
  }
};

const categoryMap = {
  waste_separation: 'wasteSeparation',
  recycling: 'recycling',
  composting: 'composting',
  hazardous_waste: 'hazardousWaste',
  environmental_impact: 'environmentalImpact'
};

export default function EducationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = contents;

    if (activeCategory !== 'all') {
      result = result.filter(c => c.category === activeCategory);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title[language]?.toLowerCase().includes(lowercasedTerm) ||
        c.content[language]?.toLowerCase().includes(lowercasedTerm)
      );
    }

    setFilteredContents(result);
  }, [searchTerm, activeCategory, contents, language]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, educationalContents] = await Promise.all([
        User.me(),
        EducationalContent.list()
      ]);
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');
      setContents(educationalContents);
      setFilteredContents(educationalContents);
    } catch (error) {
      console.error("Error loading educational data:", error);
    }
    setIsLoading(false);
  };

  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'infographic': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case 'audio': return <Headphones className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-green-600" />;
    }
  };

  const t = translations[language];

  const featuredContent = contents.filter(c => c.is_featured);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {t.all}
            </Button>
            {Object.entries(categoryMap).map(([key, value]) => (
              <Button
                key={key}
                variant={activeCategory === key ? 'default' : 'outline'}
                onClick={() => setActiveCategory(key)}
              >
                {t[value]}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredContent.length > 0 && activeCategory === 'all' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              {t.featuredArticles}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredContent.map(content => (
                <Card
                  key={content.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedContent(content)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{content.title[language]}</CardTitle>
                      {getMediaTypeIcon(content.media_type)}
                    </div>
                    <Badge variant="secondary">{t[categoryMap[content.category]]}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{content.content[language]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t.allResources}</h2>
          {filteredContents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContents.map(content => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                >
                  <Card
                    className="flex flex-col h-full hover:border-green-500 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{content.title[language]}</CardTitle>
                        {getMediaTypeIcon(content.media_type)}
                      </div>
                      <Badge variant="outline">{t[categoryMap[content.category]]}</Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3">{content.content[language]}</p>
                    </CardContent>
                    <div className="p-4 border-t mt-auto">
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setSelectedContent(content)}
                      >
                        {t.readMore} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t.noResults}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  {getMediaTypeIcon(selectedContent.media_type)}
                  <Badge variant="secondary">{t[categoryMap[selectedContent.category]]}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedContent.title[language]}</DialogTitle>
                <DialogDescription>{t.by}</DialogDescription>
              </DialogHeader>
              <div className="py-4 max-h-[60vh] overflow-y-auto">
                <p className="whitespace-pre-wrap">{selectedContent.content[language]}</p>
                {selectedContent.media_url && (
                  <div className="mt-4">
                    {selectedContent.media_type === 'video' ? (
                      <video src={selectedContent.media_url} controls className="w-full rounded-lg" />
                    ) : (
                      <a href={selectedContent.media_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        View Media
                      </a>
                    )}
                  </div>
                )}
              </div>
              {selectedContent.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center border-t pt-4">
                  <Tags className="w-4 h-4 text-gray-500" />
                  {selectedContent.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
