def get_base_data(db, models: list) -> None:
	for item in models:
		db.add(item)

	db.commit()