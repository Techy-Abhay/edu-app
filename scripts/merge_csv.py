#!/usr/bin/env python3
"""
Merge two English CSV question banks while:
- Avoiding duplicate questions
- Ensuring unique Question IDs
- Updating topics file with new topics
"""

import csv
import os
from collections import defaultdict

# File paths
MASTER_DIR = os.path.join(os.path.dirname(__file__), '..', 'master_data')
EXISTING_FILE = os.path.join(MASTER_DIR, 'Educational App - Question Bank - English.csv')
NEW_FILE = os.path.join(MASTER_DIR, 'RMS_Sainik_Class6_English_500_Questions.csv')
TOPICS_FILE = os.path.join(MASTER_DIR, 'Educational App - Question Bank - Topics.csv')
OUTPUT_FILE = os.path.join(MASTER_DIR, 'Educational App - Question Bank - English.csv')
BACKUP_FILE = os.path.join(MASTER_DIR, 'Educational App - Question Bank - English.backup.csv')

def normalize_question(question_text):
    """Normalize question text for comparison (remove extra spaces, lowercase)"""
    return ' '.join(question_text.lower().split())

def read_csv_file(filepath):
    """Read CSV file and return rows as list of dicts"""
    with open(filepath, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
        reader = csv.DictReader(f)
        return list(reader)

def write_csv_file(filepath, rows, fieldnames):
    """Write rows to CSV file"""
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

def get_next_question_id(existing_rows):
    """Find the highest question ID and return the next one"""
    max_id = 0
    for row in existing_rows:
        qid = row['QuestionID']
        if qid.startswith('ENG'):
            try:
                num = int(qid[3:])
                max_id = max(max_id, num)
            except ValueError:
                continue
    return max_id + 1

def capitalize_topic_name(topic):
    """Capitalize topic name properly"""
    # Map common lowercase patterns to proper case
    topic_mapping = {
        'collective noun': 'Collective Nouns',
        'abstract noun': 'Abstract Nouns',
        'proper noun': 'Proper Nouns',
        'common noun': 'Common Nouns',
        'material noun': 'Material Nouns',
        'countable noun': 'Countable Nouns',
        'uncountable noun': 'Uncountable Nouns',
        'gender': 'Gender',
        'possessive pronoun': 'Possessive Pronouns',
        'reflexive pronoun': 'Reflexive Pronouns',
        'interrogative pronoun': 'Interrogative Pronouns',
        'relative pronoun': 'Relative Pronouns',
        'demonstrative pronoun': 'Demonstrative Pronouns',
        'personal pronoun': 'Personal Pronouns',
        'adjective': 'Adjectives',
        'comparative adjective': 'Comparative Adjectives',
        'superlative adjective': 'Superlative Adjectives',
        'adverb': 'Adverbs',
        'verb': 'Verbs',
        'tense': 'Tenses',
        'present tense': 'Present Tense',
        'past tense': 'Past Tense',
        'future tense': 'Future Tense',
        'preposition': 'Prepositions',
        'conjunction': 'Conjunctions',
        'article': 'Articles',
        'antonym': 'Antonyms',
        'synonym': 'Synonyms',
        'idiom': 'Idioms & Phrases',
        'phrase': 'Idioms & Phrases',
        'active passive': 'Active and Passive Voice',
        'direct indirect': 'Direct and Indirect Speech',
        'sentence': 'Sentence Types',
        'spelling': 'Spellings',
        'comprehension': 'Reading Comprehension',
        'vocabulary': 'Vocabulary',
    }
    
    topic_lower = topic.lower().strip()
    if topic_lower in topic_mapping:
        return topic_mapping[topic_lower]
    
    # Default: capitalize each word
    return ' '.join(word.capitalize() for word in topic.split())

def main():
    print("🔄 Starting CSV merge process...")
    
    # Read existing data
    print(f"📖 Reading existing file: {EXISTING_FILE}")
    existing_rows = read_csv_file(EXISTING_FILE)
    print(f"   Found {len(existing_rows)} existing questions")
    
    # Read new data
    print(f"📖 Reading new file: {NEW_FILE}")
    new_rows = read_csv_file(NEW_FILE)
    print(f"   Found {len(new_rows)} new questions")
    
    # Read topics
    print(f"📖 Reading topics file: {TOPICS_FILE}")
    topics_rows = read_csv_file(TOPICS_FILE)
    existing_topics = {row['TopicName'].lower(): row for row in topics_rows if row['Subject'] == 'English'}
    print(f"   Found {len(existing_topics)} existing English topics")
    
    # Create backup
    print(f"💾 Creating backup: {BACKUP_FILE}")
    write_csv_file(BACKUP_FILE, existing_rows, existing_rows[0].keys() if existing_rows else [])
    
    # Track existing questions by normalized text
    existing_questions = {normalize_question(row['Question']): row for row in existing_rows}
    print(f"📊 Tracking {len(existing_questions)} unique questions from existing file")
    
    # Process new rows
    next_id = get_next_question_id(existing_rows)
    merged_rows = existing_rows.copy()
    new_topics = set()
    duplicates_count = 0
    added_count = 0
    
    print(f"🔍 Processing new questions (next ID: ENG{next_id:03d})...")
    
    for row in new_rows:
        normalized_q = normalize_question(row['Question'])
        
        # Check for duplicate
        if normalized_q in existing_questions:
            duplicates_count += 1
            continue
        
        # Capitalize and normalize topic name
        original_topic = row['Topic']
        normalized_topic = capitalize_topic_name(original_topic)
        row['Topic'] = normalized_topic
        
        # Track new topics
        if normalized_topic.lower() not in existing_topics:
            new_topics.add(normalized_topic)
        
        # Assign new Question ID
        row['QuestionID'] = f"ENG{next_id:03d}"
        next_id += 1
        
        # Normalize Active field to "True"
        row['Active'] = 'True'
        
        # Add to merged data
        merged_rows.append(row)
        existing_questions[normalized_q] = row
        added_count += 1
    
    print(f"✅ Processed {len(new_rows)} questions:")
    print(f"   - Added: {added_count}")
    print(f"   - Duplicates skipped: {duplicates_count}")
    print(f"   - New topics found: {len(new_topics)}")
    
    # Write merged data
    print(f"💾 Writing merged data to: {OUTPUT_FILE}")
    fieldnames = ['QuestionID', 'Class', 'Subject', 'Topic', 'Question', 'OptionA', 'OptionB', 
                  'OptionC', 'OptionD', 'CorrectAnswer', 'Explanation', 'Difficulty', 'Source', 'Active']
    write_csv_file(OUTPUT_FILE, merged_rows, fieldnames)
    print(f"   Total questions in merged file: {len(merged_rows)}")
    
    # Update topics file if there are new topics
    if new_topics:
        print(f"\n📝 Updating topics file with {len(new_topics)} new topics:")
        next_topic_id = max([int(row['TopicID'][1:]) for row in topics_rows]) + 1
        
        for topic in sorted(new_topics):
            print(f"   + {topic}")
            topics_rows.append({
                'TopicID': f"T{next_topic_id:03d}",
                'Class': '6',
                'Subject': 'English',
                'TopicName': topic,
                'Description': ''
            })
            next_topic_id += 1
        
        # Write updated topics
        print(f"💾 Writing updated topics to: {TOPICS_FILE}")
        topics_fieldnames = ['TopicID', 'Class', 'Subject', 'TopicName', 'Description']
        write_csv_file(TOPICS_FILE, topics_rows, topics_fieldnames)
        print(f"   Total topics: {len(topics_rows)}")
    else:
        print("\n✅ No new topics to add")
    
    print("\n🎉 Merge completed successfully!")
    print(f"\n📊 Summary:")
    print(f"   - Original questions: {len(existing_rows)}")
    print(f"   - New questions added: {added_count}")
    print(f"   - Total questions: {len(merged_rows)}")
    print(f"   - Duplicates skipped: {duplicates_count}")
    print(f"   - New topics added: {len(new_topics)}")
    print(f"\n💡 Backup saved at: {BACKUP_FILE}")

if __name__ == '__main__':
    main()
