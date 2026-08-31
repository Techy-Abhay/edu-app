# Quick Guide: Adding Questions (Class 6 Simple Format)

## 📚 Text-Based Subjects

Your app currently supports these **5 text-based subjects**:
- ✅ English (Grammar, Vocabulary, Tenses)
- ✅ Mathematics (Simple text, Unicode symbols only)
- ✅ Science (General science concepts)
- ✅ GK (Geography, History, Current Affairs)
- ✅ Sports (Cricket, Football, Olympics)

**Note:** Reasoning questions with visual patterns/figures are excluded for now (require images).

---

## 📝 How to Add Questions

### 1. English Questions (Easy!)

Just plain text - no special symbols needed:

```csv
QuestionID,Class,Subject,Topic,Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,Difficulty,Source,Active
ENG006,6,English,Pronouns,Which word is a pronoun?,Table,He,Run,Beautiful,B,"He" is a pronoun that replaces a person's name.,Easy,Custom,TRUE
ENG007,6,English,Verbs,What is the past tense of "go"?,Goes,Going,Went,Gone,C,The simple past tense of "go" is "went".,Easy,Custom,TRUE
```

---

### 2. Mathematics Questions (Simple Unicode)

**Copy these symbols to use:**
- Multiply: ×
- Divide: ÷
- Square root: √
- Squared: ²
- Cubed: ³

**Fractions:**
```csv
MAT006,6,Mathematics,Fractions,What is 3/4 - 1/4?,2/4,1/2,1/4,3/8,A,"3/4 - 1/4 = 2/4 (or 1/2)",Easy,Custom,TRUE
MAT007,6,Mathematics,Fractions,What is half of 24?,10,12,14,16,B,Half of 24 = 24 ÷ 2 = 12,Easy,Custom,TRUE
```

**Multiplication/Division (using ×, ÷):**
```csv
MAT008,6,Mathematics,Numbers,What is 12 × 8?,84,96,88,92,B,12 × 8 = 96,Easy,Custom,TRUE
MAT009,6,Mathematics,Numbers,What is 48 ÷ 6?,6,7,8,9,C,48 ÷ 6 = 8,Easy,Custom,TRUE
```

**Geometry:**
```csv
MAT010,6,Mathematics,Geometry,What is the perimeter of a rectangle with length 10 cm and width 5 cm?,15 cm,20 cm,30 cm,50 cm,C,Perimeter = 2(l + w) = 2(10 + 5) = 30 cm,Medium,Custom,TRUE
MAT011,6,Mathematics,Geometry,How many corners does a triangle have?,2,3,4,5,B,A triangle has 3 corners (vertices).,Easy,Custom,TRUE
```

**Square Root (using √):**
```csv
MAT012,6,Mathematics,Numbers,What is √36?,4,5,6,7,C,√36 = 6 because 6 × 6 = 36,Easy,Custom,TRUE
MAT013,6,Mathematics,Numbers,What is √49?,5,6,7,8,C,√49 = 7 because 7 × 7 = 49,Easy,Custom,TRUE
```

**Powers (using ²):**
```csv
MAT014,6,Mathematics,Numbers,What is 6²?,12,24,36,48,C,6² = 6 × 6 = 36,Easy,Custom,TRUE
MAT015,6,Mathematics,Numbers,What is 10²?,20,50,100,1000,C,10² = 10 × 10 = 100,Easy,Custom,TRUE
```

**Basic Algebra:**
```csv
MAT016,6,Mathematics,Algebra,If x - 8 = 12, what is x?,4,20,8,12,B,x = 12 + 8 = 20,Medium,Custom,TRUE
MAT017,6,Mathematics,Algebra,If 3x = 15, what is x?,3,5,12,18,B,x = 15 ÷ 3 = 5,Medium,Custom,TRUE
```

---

### 3. Science Questions

```csv
SCI006,6,Science,Physics,What is the SI unit of force?,Joule,Newton,Watt,Pascal,B,Newton (N) is the SI unit of force.,Medium,Custom,TRUE
SCI007,6,Science,Chemistry,How many elements are in water (H2O)?,1,2,3,4,B,"Water contains 2 elements: Hydrogen (H) and Oxygen (O).",Easy,Custom,TRUE
SCI008,6,Science,Biology,Which organ pumps blood in the human body?,Liver,Heart,Kidney,Lungs,B,The heart pumps blood throughout the body.,Easy,Custom,TRUE
```

---

### 4. GK Questions

```csv
GK006,6,GK,Geography,Which is the longest river in India?,Yamuna,Ganga,Narmada,Brahmaputra,B,The Ganga (Ganges) is the longest river in India.,Easy,Custom,TRUE
GK007,6,GK,History,Who was the first Prime Minister of India?,Mahatma Gandhi,Jawaharlal Nehru,Indira Gandhi,Sardar Patel,B,Jawaharlal Nehru was India's first Prime Minister.,Easy,Custom,TRUE
GK008,6,GK,Current Affairs,What is the capital of Japan?,Beijing,Seoul,Tokyo,Bangkok,C,Tokyo is the capital of Japan.,Easy,Custom,TRUE
```

---

### 5. Sports Questions

```csv
SPT006,6,Sports,Cricket,How many stumps are there in cricket?,2,3,4,5,B,There are 3 stumps at each end in cricket.,Easy,Custom,TRUE
SPT007,6,Sports,Football,How many players are in a football team?,9,10,11,12,C,A football team has 11 players on the field.,Easy,Custom,TRUE
SPT008,6,Sports,Olympics,What do the five Olympic rings represent?,5 continents,5 sports,5 countries,5 years,A,The five rings represent the five continents.,Medium,Custom,TRUE
```

---

## 🎯 Unicode Symbol Quick Reference

**How to Copy:**
1. Find the symbol below
2. Select and copy it (Ctrl+C)
3. Paste in your CSV file (Ctrl+V)

| Symbol | Meaning | Example |
|--------|---------|---------|
| × | Multiply | 12 × 8 = 96 |
| ÷ | Divide | 48 ÷ 6 = 8 |
| √ | Square root | √36 = 6 |
| ² | Squared | 5² = 25 |
| ³ | Cubed | 2³ = 8 |
| ≤ | Less than or equal | x ≤ 10 |
| ≥ | Greater than or equal | x ≥ 5 |
| π | Pi (3.14) | Area = πr² |
| ½ | Half | ½ of 10 = 5 |
| ¼ | Quarter | ¼ of 20 = 5 |
| ¾ | Three quarters | ¾ of 12 = 9 |

---

## 📌 Important Tips

✅ **Keep it simple** - Class 6 students need clear, easy-to-read text  
✅ **Use familiar notation** - "1/2" is better than complex fractions  
✅ **Unicode is optional** - "15 x 12" works just as well as "15 × 12"  
✅ **Test locally** - Run `npm run dev` to see how questions look  
✅ **All text works** - No images needed for these 5 subjects  

❌ **Avoid:**
- Complex mathematical notation (save for higher classes)
- Visual patterns (need images - add later)
- Overly long questions (keep under 2 lines)

---

## 🚀 Quick Start

**To add 10 new questions:**
1. Open the subject CSV file (e.g., `Mathematics.csv`)
2. Copy the format from existing questions
3. Increment the QuestionID (MAT006, MAT007, etc.)
4. Keep Class = 6
5. Fill in all columns
6. Set Active = TRUE
7. Upload to Google Sheets

**That's it!** Simple text questions, no images, works immediately! 📚

---

**Created by Abhay Kumar**
