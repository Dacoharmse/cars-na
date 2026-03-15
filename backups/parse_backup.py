import re

def pg_copy_val(v):
    if v == r'\N':
        return None
    v = v.replace(r'\t', '\t')
    v = v.replace(r'\n', '\n')
    v = v.replace(r'\\', '\\')
    return v

def to_sql_val(v):
    if v is None:
        return 'NULL'
    escaped = v.replace("'", "''")
    return "'" + escaped + "'"

with open("C:/Users/User/Projects/cars-na/backups/data_restore.sql", "r", encoding="utf-8") as f:
    lines = f.readlines()

tables = {}
current_table = None
current_cols = []
in_copy = False

for line in lines:
    line = line.rstrip('\n')
    copy_match = re.match(r'COPY public\."(\w+)" \(([^)]+)\) FROM stdin;', line)
    if copy_match:
        current_table = copy_match.group(1)
        current_cols = [c.strip().strip('"') for c in copy_match.group(2).split(',')]
        tables[current_table] = {'cols': current_cols, 'rows': []}
        in_copy = True
        continue
    if in_copy and line == r'\.':
        in_copy = False
        current_table = None
        continue
    if in_copy and current_table and line:
        vals = [pg_copy_val(v) for v in line.split('\t')]
        tables[current_table]['rows'].append(vals)

# Print row counts
for t, d in sorted(tables.items()):
    print(f"{t}: {len(d['rows'])} rows")

# Generate INSERT SQL for non-empty tables
out_lines = []
for t, d in tables.items():
    if not d['rows']:
        continue
    col_list = ', '.join('"' + c + '"' for c in d['cols'])
    out_lines.append(f'\n-- {t}')
    for row in d['rows']:
        vals = ', '.join(to_sql_val(v) for v in row)
        out_lines.append(f'INSERT INTO public."{t}" ({col_list}) VALUES ({vals}) ON CONFLICT DO NOTHING;')

with open("C:/Users/User/Projects/cars-na/backups/inserts.sql", "w", encoding="utf-8") as f:
    f.write('\n'.join(out_lines))

print("\nWrote inserts.sql")
