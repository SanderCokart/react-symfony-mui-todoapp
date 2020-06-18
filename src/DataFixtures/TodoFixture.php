<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Todo;

class TodoFixture extends Fixture
{
    public const TODO_REFERENCE = 'todo';
    public const TODO_REFERENCE2 = 'todo2';

    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $todo = new Todo();
        $todo->setTask("test task");
        $todo->setDescription("test description");

        $todo2 = new Todo();
        $todo2->setTask("extra task");
        $todo2->setDescription("extra description");


        $manager->persist($todo);
        $manager->persist($todo2);
        $manager->flush();

        $this->addReference(self::TODO_REFERENCE, $todo);
        $this->addReference(self::TODO_REFERENCE2, $todo2);
    }
}
