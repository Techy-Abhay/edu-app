#!/usr/bin/env python3
"""Build a curated, source-backed topic catalogue from the question-bank CSV files."""

import csv
from collections import Counter
from pathlib import Path

MASTER_DATA = Path(__file__).parent.parent / 'master_data'
TOPICS_FILE = MASTER_DATA / 'Educational App - Question Bank - Topics.csv'
BACKUP_FILE = MASTER_DATA / 'Educational App - Question Bank - Topics.backup.csv'
QUESTION_FILES = {
    'English': MASTER_DATA / 'Educational App - Question Bank - English.csv',
    'GK': MASTER_DATA / 'Educational App - Question Bank - GK.csv',
    'Mathematics': MASTER_DATA / 'Educational App - Question Bank - Mathematics.csv',
    'Science': MASTER_DATA / 'Educational App - Question Bank - Science.csv',
    'Sports': MASTER_DATA / 'Educational App - Question Bank - Sports.csv',
}

# A balanced catalogue: include topics with enough practice material, without adding
# very small one-question labels. Labels must remain identical to question Topic values.
MINIMUM_QUESTION_COUNTS = {
    'English': 4,
    'GK': 1,
    'Mathematics': 4,
    'Science': 10,
    'Sports': 5,
}

# Retain the better-supported label where two labels describe the same topic.
ALIASES_TO_EXCLUDE = {
    'English': {
        'Idioms & Phrases', 'One-word Substitution', 'Sentence Types',
        'Noun Type', 'Noun Formation', 'Noun Identification', 'Noun Number',
        'Noun Usage', 'Plural Spelling', 'Possessive Noun',
    },
    'Mathematics': {
        'Decimals', 'Ratio & Proportion', 'Speed, Distance & Time',
        'Basic Geometry', 'Mensuration',
    },
    'Science': {'Water & Air', 'Motion & Distance', 'Light & Reflections'},
    'Sports': {'Olympic Games', 'Sports Terms'},
}


def question_counts(path: Path) -> Counter:
    with path.open('r', encoding='utf-8-sig', newline='') as file:
        return Counter((row['Topic'] or '').strip() for row in csv.DictReader(file))


def write_topics(rows: list[dict]) -> None:
    fieldnames = ['TopicID', 'Class', 'Subject', 'TopicName', 'Description']
    with TOPICS_FILE.open('w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    if not BACKUP_FILE.exists():
        BACKUP_FILE.write_bytes(TOPICS_FILE.read_bytes())

    rows = []
    topic_number = 1
    for subject, path in QUESTION_FILES.items():
        counts = question_counts(path)
        selected_topics = [
            (topic, count)
            for topic, count in counts.items()
            if count >= MINIMUM_QUESTION_COUNTS[subject]
            and topic not in ALIASES_TO_EXCLUDE.get(subject, set())
        ]
        for topic, count in sorted(selected_topics, key=lambda item: item[0].casefold()):
            rows.append({
                'TopicID': f'T{topic_number:03d}',
                'Class': '6',
                'Subject': subject,
                'TopicName': topic,
                'Description': f'{count} questions available.',
            })
            topic_number += 1
        print(f'{subject}: {len(selected_topics)} topics')

    write_topics(rows)
    print(f'Total curated topics: {len(rows)}')
    print(f'Backup: {BACKUP_FILE}')


if __name__ == '__main__':
    main()
