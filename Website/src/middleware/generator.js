const userModel = require('./../data/models/userModel');
const categoryModel = require('./../data/models/categoryModel');
const keys = require('./../config/keys');
const bcrypt = require('bcryptjs');

module.exports.generateUsers = async function() {
    const artists = ['Vincent van Gogh', 'Wassily Kandinsky', 'Leonardo da Vinci', 'Ivan Konstantinovich Aivazovsky', 'John Collier', 'Adolphe-William Bouguereau', 'Caspar David Friedrich', 'Grant Wood', 'Thomas Eakins', 'Gustav Klimt', 'Jean-Honore Fragonard', 'Amedeo Modigliani', 'Eugene Delacroix', 'Marcel Duchamp', 'Frans Hals', 'Domenikos Theotokopoulos El Greco', 'Camille Jacob Pissarro', 'Paul Gauguin', 'Francois Boucher', 'Diego Rodriguez de Silva Velazquez', 'John Singer Sargent', 'Pierre-Auguste Renoir', 'Raffaello Sanzio Raphael', 'Edvard Munch', 'Edouard Manet', 'Giorgio da Castelfranco Giorgione', 'Sandro Botticelli', 'Johannes Vermeer, van Delft', 'Jan van Eyck', 'Pieter Bruegel the Elder', 'Hans Holbein the Younger', 'Jean-Francois Millet', 'Michelangelo Merisi da Caravaggio', 'Lord Frederick Leighton', 'Hieronymus Bosch', 'Hilaire Germain Edgar Degas', 'Paul Cezanne', 'Sir John Everett Millais', 'John William Waterhouse', 'Gustave Caillebotte', 'Claude Monet', 'Francisco de Goya', 'Tiziano Vecellio Titian', 'James Whistler', 'Jean Auguste Dominique Ingres', 'Henri Rousseau (Le Douanier)', 'Jacques-Louis David', 'Joseph Mallord William Turner', 'van Rijn Rembrandt', 'Nicolas Poussin']
    const files = ['59a0e64e-a196-4e20-8507-fae07e64bbd9.jpg', '66d051db-7585-4c59-accb-28459c10e6b2.jpg', '128e1cf5-7d9c-45d4-b7c6-1633cff2e4c6.jpg', 'b5016fc4-1922-4786-bc56-95796a2b1975.jpg', '0f6f11c5-a24e-4ec1-aafb-069c85fcb48a.jpg', '6d36c69a-1661-47c2-b8c1-ba5eb3fc9aa1.jpg', '4a76897f-d562-4eb1-8564-53d40fdd0119.jpg', '76ee2bc3-8965-4b0a-9890-5494d853f763.jpg', '78519489-6af3-4264-93eb-6ac22f7fce7b.jpg', 'ba91ff81-7c13-4115-ba51-04da1474e6c5.jpg', 'f376f5ab-0581-4a51-b6a7-8d2879a42c5b.jpg', 'b65f8b8a-a273-4b91-828d-4dbcdd8b48f6.jpg', '69938d7b-fc47-47df-b719-0e2601dc7a09.jpg', '75bd646f-eae1-474a-ac3e-0219132e6b23.jpg', '73ae8885-2f9b-49d7-bf0f-4fe22ca32164.jpg', 'f4c21b4b-bbe1-4ab6-ac66-83de7d0f5b24.jpg', '31519193-3de5-438d-90ef-1aebf800039f.jpg', '3c05f5b9-8bab-407c-95b6-1324a53bf1f9.jpg', '07dfdecb-4d82-48a6-9be6-db6c0e263f1a.jpg', '58b5239b-9312-4540-b635-90e902bfc9f1.jpg', '90998d4d-7924-4816-9b4a-634252c15d8d.jpg', '5595a5e7-8bb3-4d08-80ca-0b9ed53ffe48.jpg', '5569e1a5-4402-4e7c-ab22-52b3f3c4007d.jpg', '38520a81-f78e-4c62-a967-46b957cf2e4e.jpg', '21ae6a44-9017-47a7-a45d-6f1a2f1a06b8.jpg', '66f7e0b2-fdd4-4589-b390-e62e32c31f00.jpg', 'ae48cb06-c8e7-49f8-b245-7560343e2bb8.jpg', '65dd2e24-887e-47e6-83ef-2a99e6adaceb.jpg', '2ee968b4-249f-4740-a798-1576633a1e5c.jpg', '93e00e9c-f0a8-4492-840c-6f6a18560692.jpg', '0fbdee01-d19e-40aa-ab40-b840e7a37ef8.jpg', 'ca630026-9181-432f-8f88-e44a28e4daf1.jpg', '9c35e9d4-b1b0-49c9-8d36-ceca1a8f63aa.jpg', 'e81f6913-ab30-4527-8c3d-3cc9f492d30e.jpg', '4a40ec10-4fbf-4842-8f87-98b4c5745e02.jpg', '57fc96bf-2c42-4b3b-8655-5da8afc947bf.jpg', '2e597919-0bd1-4dc5-9ba2-3ffe2506a17c.jpg', '99fbbb9e-ca25-486b-a9ef-3366d8bd12a4.jpg', 'c56779b2-a0c8-4720-bd58-29cfc3f45122.jpg', 'a8ae4765-ec23-425f-b9a3-be15129e3efb.jpg', 'd2f188f7-593e-43cb-92e3-e25279ed165a.jpg', '708c3b24-3fa3-49ea-a47e-8363862c3131.jpg', '60a98468-4c56-46aa-be01-d17a485acf37.jpg', 'c9f3677d-5b32-4c06-bd1a-e55a0d0aa32c.jpg', '76e2734a-821f-4abe-bd63-8511b73e6eb8.jpg', '69d8a767-6dab-448b-bdf8-9d4909b29269.jpg', '114f248d-d04e-410e-9ef4-0633a9c71b73.jpg', '31f56330-80a1-42f4-a264-a2a183d11513.jpg', '710e0fec-f879-41a1-b422-3e3082dddda7.jpg', '4c742e86-cd3c-4c97-b249-2bd06f1f6876.jpg']
    console.log(artists.length)
    console.log(files.length)
    await userModel.deleteMany({});
    for (let i = 0; i < artists.length; i++) {
        const artist = artists[i];
        const login = artist.split(' ')[0].toLowerCase() + `${i}`;
        const encryptedPassword = bcrypt.hashSync(login + '123', keys.salt);
        const user = new userModel({
            login: login,
            password: encryptedPassword,
            username: artist,
            imageUrl: '/uploads/' + files[i],
            topRated: false,
            friends: [],
            posts: [],
            chats: [],
            friend_requests: []
        })
        await user.save();
    }
}

module.exports.generateCategories = async function() {
    const names = ['Easel', 'Graffiti', 'Decorative', 'Digital', 'Design']
    const descriptions = [
        'One of the varieties of the art of painting, the works of which have an independent meaning and are perceived independently of the environment. Literally - painting created on an easel.',
        'Images or inscriptions scratched, written or drawn with paint or ink on walls and other surfaces.',
        'Decoration of wall surfaces, furniture, interior details and all kinds of objects with drawings or images of various subjects.',
        'An emerging art form that uses traditional painting techniques such as watercolor, oil, etc. applied with digital tools using a computer, graphics tablet and pen, and software',
        'The activity of designing the aesthetic properties of industrial products (“artistic design”), as well as the result of this activity'
    ]
    const images = ['easel.jpg', 'graffiti.jpg', 'digital.jpg', 'design.jpg']
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const description = descriptions[i]
        const image = images[i]
        const category = new categoryModel({
            title: name,
            description: description,
            imageUrl: '/uploads/' + image
        })
        await category.save();
    }
}