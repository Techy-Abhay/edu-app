#!/usr/bin/env python3
"""Normalize every question Topic to an existing subject-specific catalogue topic."""

import csv
from pathlib import Path

MASTER_DATA = Path(__file__).parent.parent / 'master_data'
TOPICS_FILE = MASTER_DATA / 'Educational App - Question Bank - Topics.csv'
QUESTION_FILES = {
    'English': MASTER_DATA / 'Educational App - Question Bank - English.csv',
    'GK': MASTER_DATA / 'Educational App - Question Bank - GK.csv',
    'Mathematics': MASTER_DATA / 'Educational App - Question Bank - Mathematics.csv',
    'Science': MASTER_DATA / 'Educational App - Question Bank - Science.csv',
    'Sports': MASTER_DATA / 'Educational App - Question Bank - Sports.csv',
}

TOPIC_MAPPINGS = {
    'English': {
        'Abstract Nouns': 'Nouns', 'Collective Nouns': 'Nouns', 'Common Nouns': 'Nouns',
        'Compound Noun': 'Nouns', 'Countable Nouns': 'Nouns', 'Gender': 'Nouns',
        'Material Nouns': 'Nouns', 'Noun Formation': 'Nouns', 'Noun Identification': 'Nouns',
        'Noun Number': 'Nouns', 'Noun Type': 'Nouns', 'Noun Usage': 'Nouns',
        'Possessive Noun': 'Nouns', 'Proper Nouns': 'Nouns', 'Uncountable Nouns': 'Nouns',
        'Plural Spelling': 'Spellings', 'Idioms & Phrases': 'Idioms',
        'One-word Substitution': 'One Word Substitution', 'Sentence Types': 'Sentences',
        'Jumbled Sentences': 'Sentences', 'Question Tags': 'Sentences',
        'Active and Passive Voice': 'Verbs', 'Direct and Indirect Speech': 'Verbs',
    },
    'Mathematics': {
        'Basic Geometry': 'Geometry', 'Decimals': 'Decimal Numbers',
        'Mensuration': 'Area and Perimeter', 'Ratio & Proportion': 'Ratio and Proportion',
        'Speed, Distance & Time': 'Time, Speed and Distance',
    },
    'Science': {
        'Light & Reflections': 'Light Shadows & Reflections',
        'Motion & Distance': 'Motion & Measurement', 'Water & Air': 'Water',
    },
    'Sports': {
        'Olympic Games': 'Olympics', 'Sports Terms': 'Sports Terminology',
        'Asian Games': 'Olympics', 'Commonwealth Games': 'Olympics',
        'National Sports': 'General Sports', 'Archery': 'General Sports',
        'Baseball': 'General Sports', 'Billiards': 'General Sports', 'Boxing': 'General Sports',
        'Chess': 'General Sports', 'Handball': 'General Sports', 'Kabaddi': 'Traditional Games',
        'Kho-Kho': 'Traditional Games', 'Rugby Union': 'General Sports',
        'Swimming': 'General Sports', 'Table Tennis': 'General Sports', 'Volleyball': 'General Sports',
        'Neeraj Chopra': 'Indian Sportspersons', 'P. V. Sindhu': 'Indian Sportspersons',
        'Sachin Tendulkar': 'Indian Sportspersons', 'Dhyan Chand': 'Indian Sportspersons',
        'Viswanathan Anand': 'Indian Sportspersons', 'Sania Mirza': 'Indian Sportspersons',
        'Mary Kom': 'Indian Sportspersons', 'Abhinav Bindra': 'Indian Sportspersons',
        'Sushil Kumar': 'Indian Sportspersons', 'Hima Das': 'Indian Sportspersons',
        'Dipa Karmakar': 'Indian Sportspersons', 'Mirabai Chanu': 'Indian Sportspersons',
        'Lovlina Borgohain': 'Indian Sportspersons', 'Manu Bhaker': 'Indian Sportspersons',
        'Rohit Sharma': 'Indian Sportspersons', 'M. S. Dhoni': 'Indian Sportspersons',
        'Kapil Dev': 'Indian Sportspersons', 'Leander Paes': 'Indian Sportspersons',
        'Pankaj Advani': 'Indian Sportspersons', 'Bajrang Punia': 'Indian Sportspersons',
    },
}


def read_rows(path: Path) -> list[dict]:
    with path.open('r', encoding='utf-8-sig', newline='') as file:
        return list(csv.DictReader(file))


def write_rows(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    with path.open('w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    catalogue = read_rows(TOPICS_FILE)
    approved = {}
    for row in catalogue:
        approved.setdefault(row['Subject'], set()).add(row['TopicName'])

    total_changed = 0
    for subject, path in QUESTION_FILES.items():
        rows = read_rows(path)
        fieldnames = list(rows[0])
        changed = 0
        for row in rows:
            old_topic = row['Topic'].strip()
            new_topic = TOPIC_MAPPINGS.get(subject, {}).get(old_topic, old_topic)
            if new_topic not in approved[subject]:
                raise ValueError(f'{path.name}: no approved topic mapping for {old_topic!r}')
            if new_topic != old_topic:
                row['Topic'] = new_topic
                changed += 1
        write_rows(path, rows, fieldnames)
        total_changed += changed
        print(f'{subject}: {changed} questions normalized')

    print(f'Total questions normalized: {total_changed}')


if __name__ == '__main__':
    main()
