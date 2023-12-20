class Advertisement {
  late String id;
  late String idAnimal;
  late String idUser;
  late String state;
  late String createdAt;
  late double latitude;
  late double longitude;

  Advertisement(this.id, this.idAnimal, this.idUser, this.state, this.createdAt,
      this.latitude, this.longitude);

  factory Advertisement.fromJson(dynamic json, String id) {
    return Advertisement(
      id,
      json['id_animal'] as String,
      json["id_user"] as String,
      json["state"] as String,
      json["created_at"] as String,
      json["latitude"] as double,
      json["longitude"] as double,
    );
  }

  Map toJson() => {
        'id': id,
        'id_animal': idAnimal,
        'id_user': idUser,
        'created_at': createdAt,
        'latitude': latitude,
        'longitude': longitude,
      };
}
