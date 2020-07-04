<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200704004215 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tag (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE todo (id INT AUTO_INCREMENT NOT NULL, task VARCHAR(10) NOT NULL, description VARCHAR(500) NOT NULL, UNIQUE INDEX UNIQ_5A0EB6A0527EDB25 (task), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE todo_tag (todo_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_D767A0BAEA1EBC33 (todo_id), INDEX IDX_D767A0BABAD26311 (tag_id), PRIMARY KEY(todo_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, username VARCHAR(100) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE todo_tag ADD CONSTRAINT FK_D767A0BAEA1EBC33 FOREIGN KEY (todo_id) REFERENCES todo (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE todo_tag ADD CONSTRAINT FK_D767A0BABAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE todo_tag DROP FOREIGN KEY FK_D767A0BABAD26311');
        $this->addSql('ALTER TABLE todo_tag DROP FOREIGN KEY FK_D767A0BAEA1EBC33');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE todo');
        $this->addSql('DROP TABLE todo_tag');
        $this->addSql('DROP TABLE user');
    }
}
