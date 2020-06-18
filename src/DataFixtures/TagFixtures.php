<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Tag;

class TagFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);

        $tag = new Tag();
        $tag->setName("Groceries");
        $tag->addTodo($this->getReference(TodoFixture::TODO_REFERENCE));
        $tag->addTodo($this->getReference(TodoFixture::TODO_REFERENCE2));

        $manager->persist($tag);
        $manager->flush();
    }

    public function getDependencies()
    {
        return array(
            TodoFixture::class,
        );
    }
}
