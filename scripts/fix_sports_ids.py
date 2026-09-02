#!/usr/bin/env python3
import csv
import re
from pathlib import Path

FILE = Path(r"c:\OtherData\Edu_App\master_data\Educational App - Question Bank - Sports.csv")
BACKUP = FILE.with_suffix('.backup.csv')

FIELDNAMES = [
    'QuestionID','Class','Subject','Topic','Question','OptionA','OptionB','OptionC','OptionD',
    'CorrectAnswer','Explanation','Difficulty','Source','Active'
]


def duplicate_key(row: dict) -> tuple[str, ...]:
    """Identify only identical question records, excluding their generated ID."""
    return tuple((row.get(field) or '').strip() for field in FIELDNAMES if field != 'QuestionID')


def read_rows(path: Path):
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def write_rows(path: Path, rows):
    with path.open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def main():
    # Always rebuild from the untouched backup so the cleanup can be rerun safely.
    if not BACKUP.exists():
        raise FileNotFoundError(f'Missing backup file: {BACKUP}')
    rows = read_rows(BACKUP)

    # Find first duplicate restart (second SPT001 block).
    seen_ids = set()
    restart_idx = None
    for i, r in enumerate(rows):
        qid = (r.get('QuestionID') or '').strip()
        if qid in seen_ids:
            restart_idx = i
            break
        seen_ids.add(qid)

    if restart_idx is None:
        restart_idx = len(rows)

    # Re-sequence the restarted block from SPT501.
    resequenced = 0
    next_id = 501
    for i in range(restart_idx, len(rows)):
        rows[i]['QuestionID'] = f"SPT{next_id:03d}"
        next_id += 1
        resequenced += 1

    # Remove only exact duplicate records, keeping the first occurrence.
    unique_rows = []
    seen_q = set()
    removed = 0

    for r in rows:
        key = duplicate_key(r)
        if key in seen_q:
            removed += 1
            continue
        seen_q.add(key)
        unique_rows.append(r)

    write_rows(FILE, unique_rows)

    print(f"Rows before: {len(rows)}")
    print(f"Second block starts at row index: {restart_idx}")
    print(f"Rows re-sequenced from SPT501: {resequenced}")
    print(f"Duplicate questions removed: {removed}")
    print(f"Rows after: {len(unique_rows)}")
    print(f"Backup: {BACKUP}")


if __name__ == '__main__':
    main()
