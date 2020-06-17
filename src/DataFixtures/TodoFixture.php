<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Todo;

class TodoFixture extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $todo = new Todo();
        $todo->setTask("test task");
        $todo->setDescription("test description");

        $manager->persist($todo);
        $manager->flush();
    }
}
