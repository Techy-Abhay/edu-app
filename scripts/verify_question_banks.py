#!/usr/bin/env python3
"""Report IDs and topic catalogue integrity for all question banks."""
import csv
from collections import Counter, defaultdict
from pathlib import Path

DATA = Path(__file__).parent.parent / 'master_data'
TOPICS = DATA / 'Educational App - Question Bank - Topics.csv'
BANKS = {
    'English': DATA / 'Educational App - Question Bank - English.csv',
    'Mathematics': DATA / 'Educational App - Question Bank - Mathematics.csv',
    'Science': DATA / 'Educational App - Question Bank - Science.csv',
    'Sports': DATA / 'Educational App - Question Bank - Sports.csv',
    'GK': DATA / 'Educational App - Question Bank - GK.csv',
}


def read_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as file:
        return list(csv.DictReader(file))


def main():
    catalogue = read_csv(TOPICS)
    allowed = defaultdict(set)
    for item in catalogue:
        allowed[item['Subject']].add(item['TopicName'])

    total_questions = 0
    all_valid = True
    print('QUESTION BANK INTEGRITY REPORT')
    for subject, path in BANKS.items():
        rows = read_csv(path)
        total_questions += len(rows)
        ids = [row['QuestionID'] for row in rows]
        counts = Counter(row['Topic'] for row in rows)
        duplicate_ids = len(rows) - len(set(ids))
        unmapped = sorted(set(counts) - allowed[subject])
        complete = not duplicate_ids and not unmapped
        all_valid = all_valid and complete

        print(f'\n{subject}')
        print(f'  Questions: {len(rows)}')
        print(f'  IDs: {len(set(ids))} unique; {duplicate_ids} duplicates')
        print(f'  Topics: {len(counts)}/{len(allowed[subject])} catalogue topics used')
        print(f'  Unmapped topics: {len(unmapped)}' + (f" ({', '.join(unmapped)})" if unmapped else ''))
        print('  Distribution: ' + '; '.join(f'{topic}={count}' for topic, count in sorted(counts.items())))

    print('\nCATALOGUE SUMMARY')
    print(f'  Topics total: {len(catalogue)}')
    print('  By subject: ' + '; '.join(f'{subject}={len(allowed[subject])}' for subject in BANKS))
    print(f'  Questions total: {total_questions}')
    print(f'  RESULT: {"PASS" if all_valid else "FAIL"}')


if __name__ == '__main__':
    main()
