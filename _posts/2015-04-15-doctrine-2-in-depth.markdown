---
author: ww
comments: true
date: 2015-04-15 06:58:33+00:00
layout: post
link: http://www.gl6.cc/blog/doctrine-2-in-depth.html
slug: doctrine-2-in-depth
title: Doctrine 2 in Depth
wordpress_id: 67
categories:
- PHP
tags:
- doctrine
---

The Doctrine 2 ORM implements the data mapper pattern: mapping a domain model to a relational database, separating the domain logic from the persistence layer. Not all objects in the domain model have to be persisted, and those entities that are don’t need to extend an abstract base class or interface; however, they must conform to these conventions:

Entity classes must not be final or contain final methods.
Additionally an entity must not implement __clone nor __wakeup (or do so safely).
All properties should be private or protected.
Properties within a class hierarchy cannot have the same name.
To prevent loading the complete database in memory, Doctrine generates lazy–load proxies for all associations that haven’t been explicitly retrieved from the database.

To support lazy–loading of collections, simple PHP arrays must to be replaced by the generic collection interface Doctrine\Common\Collections\Collection, which acts as an array by extending the ArrayAccess, IteratorAggregate and Countable interfaces. The class \Doctrine\Common\Collections\ArrayCollection is an implementation of the Collection interface.

Warning

Lazy–load proxies always contain an instance of Doctrine’s EntityManager and all its dependencies. Therefore a var_dump() will possibly dump a very large recursive structure which is impossible to render and read. You have to use Doctrine\Common\Util\Debug::dump() to restrict the dumping to a human readable level. Additionally you should be aware that dumping the EntityManager to a Browser may take several minutes, and the Debug::dump() method just ignores any occurrences of it in Proxy instances.

How to avoid reservered word conflicts

To avoid column or table name conflicts with reserved RDMS words, use the backtick, to do “Identifier Quoting”.

<?php // we want a column named 'number', which is a reserved word, so we use backticks.
/** @ORM\Column(name="`number`", type="integer") */
private $number;
Configuration

Configuration is explained here.

Development vs Production Configuration

Doctrine 2 should be configured for both production and development runtime models. In production mode using an PHP opcode cache, like APC, is essential, while in development use ArrayCache, as this will prevent fatal errors that occur when you change your entities but the cache still contains the old metadata.

Furthermore, as shown below, auto generate proxy classes should be true in development and to false in production. Using true in production can seriously hurt your script performance if several proxy classes are re-generated during script execution. Such filesystem calls can even be slower than all the database queries made by Doctrine. In addition, when the proxies are written to disk, an exclusive file lock is set, which can cause serious performance bottlenecks in systems with regular concurrent requests.

Tip

Your code should check the environment mode flag and set the auto-generate proxies flag accordingly:

setAutoGenerateProxyClasses(APPLICATION_ENV === 'development' ? true : false);
In the development environment, the ./Proxies subdirectory needs to be to be writable by the webserver. In production, you manually generate the proxies using the doctrine command line tool:

$ doctrine orm:generate-proxies ./Proxies
Metadata Mappings for Associations

As discussed above, the three types of multiplicities in associations are:

One–to–One
One–to–Many (also known as Many–to–One)
Many–to–Many, which in SQL requires an intermediate join–table (also known as an associate table).
Again, in the domain model, associations can be unidirectional or bidirectional, where each object knows of the other. Both uni– and bidirectional relationships have an owning owning side. Bidirectional relationships must additionaly designate the inverse (or non-owning) side of the relationship.

Important

The programmer must manager the consistency of bi–directional references. Doctrine cannot magically update your collections to be consistent. Changes to collections are saved or updated whenever the entity that owns the bi–directional relationship is saved or updated. It is therefore the programmer’s responsibility to insure that the non-owning side (inverse side) of the relation stays consist with the owning side.

Tip

There is a very simple rule for deciding which side is more suitable as the owning side: ask which entity is responsible for managing the connection. Make it the owning side.

These rules apply to bidirectional relationship annotaions:

In a many side of a one–to–many/many–to–one bidirectional relationship, the many side must be the owning side; that is, the @ManyToOne side will be the owning side.
In many–to–one (also known as one–to–many) bidirectional relationships, the many side must be the owning side, the side with the inversedBy attribute, while the inverse, or non-owning, side must use the mappedBy attribute. A OneToMany relation can only be the owning side, if its implemented using a ManyToMany relation with join table and restricting the one side to allow only UNIQUE values.
In a many-to-many relation, either side can be the owning side of the relation. However in a bi-directional many-to-many relation only one is allowed to be.
Important

These attributes that must be used with all bidirectional associations

The inverse side of a bidirectional relationship must refer to its owning side by use of the mappedBy attribute of the @OnetoOne, @OneToMany, or @ManyToMany mapping declaration. The mappedBy attribute designates the field in the entity that is the owner of the relationship.
The owning side of a bidirectional relationship must refer to its inverse side by use of the inversedBy attribute of the @OneToOne, ManyToOne, or @ManyToMany mapping declaration. The inversedBy attribute designates the field in the entity that is the inverse side of the relationship.
Doctrine assumes sensible mapping default values, so @JoinColumn and @JoinTable are usually optional and have sensible default values.

Birectional Example: Article and article Tag. Whenever you connect an Article to a Tag or vice-versa, it is the Article that is responsible for this relation. Whenever you add a new article, you want to connect it with existing or new tags. Your ‘create Article’ form will probably support this notion, and it will allow you to specify the tags directly. Picking Article as owning side makes the design more logical:

addArticle($this); // synchronously updating inverse side
        $this->tags[] = $tag;
    }
}

class Tag   {

    private $articles;

    public function addArticle(Article $article)
    {
        $this->articles[] = $article;
    }
}
This allows us to group adding tags logic on the Article side of the association:

addTag($tagA);
$article->addTag($tagB);
Here is a summary of key points about associations and how they work:

In a one–to–one relation the owning side is the side that holds the foreign key of the related entity.
In a many–to–many relation, either side may be the owning side (the side that defines the @JoinTable and/or does not make use of the mappedBy attribute, thus using a default join table).
In a many–to–one relation, the default owning side is the many-side which will hold the foreign key. This makes the one–to–many side of the relation the inverse side by default. The exception is a one–to–many unidirectional relationsip (See note below).
In a bi–directional many–to–many relation only one side can be the owning side.
Note

In a one–to–many unidirectional relationship, you can make the one–to–many side the owning side; however, you must implemented it using a many–to–many relation with a join–table and you must restrict the many-side to UNIQUE values (see One–To–Many, Unidirectional with Join Table for a complete example of how to do this).

Cascade and Associations

CASCADE ON DELETE

CASCADE ON DELETE is a way of maintaining referential integrity. For example, if my database has contacts and telephones, where a contact has zero or more (one to many) phones associated with it, I implement this one-to-many/many-to-one bidirectional relationship with a foreign key.

CREATE TABLE contacts
 (contact_id BIGINT AUTO_INCREMENT NOT NULL,
 name VARCHAR(75) NOT NULL,
 PRIMARY KEY(contact_id)) ENGINE = InnoDB;

CREATE TABLE phone_numbers
 (phone_id BIGINT AUTO_INCREMENT NOT NULL,
  phone_number CHAR(10) NOT NULL,
 contact_id BIGINT NOT NULL,
 PRIMARY KEY(phone_id),
 UNIQUE(phone_number)) ENGINE = InnoDB;

ALTER TABLE phone_numbers ADD FOREIGN KEY (contact_id) REFERENCES contacts(contact_id);

INSERT INTO table contacts(fname, lname) VALUES('Robert', 'Smith');
INSERT INTO table phone_numbers(phone_number, contact_id) VALUES('8963333333', 1);
INSERT INTO table phone_numbers(phone_number, contact_id) VALUES('8964444444', 1);
If I want phone_numbers to be automatically deleted when their associated contact is deleted, then I can add ON DELETE CASCADE to the foreign key constraint:

ALTER TABLE phone_numbers ADD FOREIGN KEY (contact_id) REFERENCES
        contacts(contact_id) ON DELETE CASCADE ON UPDATE CASCADE;
Now when a contact is deleted, all its associated phone numbers will automatically be deleted:

/* The delete cascades to the phone_numbers table */
DELETE TABLE contacts as c WHERE c.id=1;
Achieving DB Level Cascading Delete in Doctrine

In Doctrine to get ON DELETE CASCADE behavoir you must configure the @JoinColumn with the onDelete=CASCADE option.

phonenumbers = new ArrayCollection();

        if (!is_null($name)) {

            $this->name = $name;
        }
    }

    public function getId()
    {
       return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function addPhonenumber(Phonenumber $p)
    {
         if (!$this->phonenumbers->contains($p)) {

             $this->phonenumbers[] = $p;
             $p->setContact($this);
         }
    }

    public function removePhonenumber(Phonenumber $p)
    {
         $this->phonenumbers->remove($p);
    }
}

number = $number;
        }
     }

     public function setPhonenumber($number)
     {
        $this->number = $number;
     }

     public function setContact(Contact $c)
     {
        $this->contact = $c;
     }
}
Then to persists these objects...

persist($phone1);
$em->persist($phone2);
$contact->addPhonenumber($phone1);
$contact->addPhonenumber($phone2);

$em->persist($contact);

try {

    $em->flush();
} catch(Exception $e) {

    $m = $e->getMessage();
    echo $m . "  
\n";
}
Once saved to the database, if we later remove a Contact, all its associated Phonenumbers will be delete

remove($contact);
Cascade at the ORM level

cascade={“persist”}

If we had not explicitly called both $em->persist($phone1) and $em->persiste($phone2) above before we persisted $contact, we would have gotten this exception message when flush() was called:

A new entity was found through the relationship EntityContact#phonenumbers that was not configured to cascade persist operations for entity Entity\Phonenumber@000000005daf67f500000000c1fa40cb. To solve this issue: Either explicitly call EntityManager#persist() on this unknown entity or configure cascade persist this association in the mapping for example @ManyToOne(..,cascade={“persist”}). If you cannot find out which entity causes the problem implement Entityphonenumbers#__toString() to get a clue.
But if we add cascade={"persist"} to the @OneToMany annotation in Contacts

persist($phone) for each phone number before calling $contact->addPhonenumber($phone). Therefore out code above can be simplified

addPhonenumber(new Phonenumber("8173333333");
$contact->addPhonenumber(new Phonenumber("8174444444");

$em->persist($contact);

try {

    $em->flush();
} catch(Exception $e) {

   $m = $e->getMessage();
   echo $m . "  
\n";
}
Association Examples

One–To–One unidirectional

Here is an example of a Product that has one Shipping object associated to it. Because the Shipping object does not refer to the Product being shipped, it is unidirectional relationship.

<?php
/** @ORM\Entity */
class Product {
    // ...

    /**
     * @ORM\OneToOne(targetEntity="Shipping")
     * @ORM\JoinColumn(name="shipping_id", referencedColumnName="id")
     */
    private $shipping;

    // ...
}

/** @ORM\Entity */
class Shipping {
    // ...
}
The SQL that would be generated by ‘doctrine orm:schema-tool:create –dump-sql’ would look like

CREATE TABLE Product (
     id INT AUTO_INCREMENT NOT NULL,
     shipping_id INT DEFAULT NULL,
     PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE Shipping (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE Product ADD FOREIGN KEY (shipping_id) REFERENCES Shipping(id);
One–To–One bidirectional

A birectional one–to–one relationship between a Customer and a Cart. Because the Cart has a reference back to the Customer, it is bidirectional. Because the Cart maintains the relationship, we make it the owning side.

<?php
/** @ORM\Entity */
class Customer {
    // ...

    /**
     * @ORM\OneToOne(targetEntity="Cart", mappedBy="customer")
     */
    private $cart;

    // ...
}

/** @ORM\Entity */
class Cart {
    // ...

    /**  The owning side has 'inversedBy'. Its table will have
     *   the foreign key.
     * @ORM\OneToOne(targetEntity="Customer", inversedBy="cart")
     * @ORM\JoinColumn(name="customer_id", referencedColumnName="id")
     */
    private $customer;

    // ...
}
Corresponding SQL generated:

CREATE TABLE Cart (
    id INT AUTO_INCREMENT NOT NULL,
    customer_id INT DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE Customer (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE Cart ADD FOREIGN KEY (customer_id) REFERENCES Customer(id);
One–To–One self referencing

In this self-referencing relationship, a Student has a mentor who is also a student.

<?php
/** @ORM\Entity */
class Student {
    // . . .

    /**
     * @ORM\OneToOne(targetEntity="Student")
     * @ORM\JoinColumn(name="mentor_id", referencedColumnName="id")
     */
    private $mentor;

    // . . .
}
The generated SQL:

CREATE TABLE Student (
    id INT AUTO_INCREMENT NOT NULL,
    mentor_id INT DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE Student ADD FOREIGN KEY (mentor_id) REFERENCES Student(id);
One–To–Many, Unidirectional with Join Table

A unidirectional one–to–many association must be mapped through a join table. It is mapped as a unidirectional many–to–many relation with a uniqueness constraint on the many-side of the join–table that enforces the one–to–many cardinality. The following example sets up such a unidirectional one–to–many association:

phonenumbers = new \Doctrine\Common\Collections\ArrayCollection();
    }

    // ...
}

/** @ORM\Entity */
class Phonenumber {
    // ...
}
Note

Again, One-To-Many uni-directional relations with join–table only work using the @ORMManyToMany annotation and a unique=true constraint on the many side of the join table.

The following SQL is generated:

CREATE TABLE User (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE users_phonenumbers (
    user_id INT NOT NULL,
    phonenumber_id INT NOT NULL,
  **UNIQUE INDEX** users_phonenumbers_phonenumber_id_uniq (phonenumber_id),
    PRIMARY KEY(user_id, phonenumber_id)
) ENGINE = InnoDB;

CREATE TABLE Phonenumber (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE users_phonenumbers ADD FOREIGN KEY (user_id) REFERENCES User(id);
ALTER TABLE users_phonenumbers ADD FOREIGN KEY (phonenumber_id) REFERENCES Phonenumber(id);
Note

Note the UNIQUE INDEX that was generated. It is necessary to coerce the many–to–many relationship into a many–to–one relationship.

A one–to–many unidirectional relationship can only be implemented with a join–table combined with a uniqueness constraint. It makes more sense, from a database perspective, for the ‘comments’ table to have an ‘article_id’ foreign key that references the ‘article’ table, but this would force us to use aOne–to–ManyMany–to–One bidirectional relationship.

Many–To–One, Unidirectional

To easily implement a many–to–one unidirectional association:

<?php
/** @ORM\Entity */
class User {
    // ...

    // more than one User can live at the same Address. Thus, Many (one or more) User(s)
    // to One Address
    /**
     * @ORM\ManyToOne(targetEntity="Address")
     * @ORM\JoinColumn(name="address_id", referencedColumnName="id")
      // @ORM\JoinColumn is not really needed as these are the default
     */
    private $address;
}

/** @ORM\Entity */
class Address {
    // ...
}
The generated SQL:

CREATE TABLE User (
    id INT AUTO_INCREMENT NOT NULL,
    address_id INT DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE Address (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE User ADD FOREIGN KEY (address_id) REFERENCES Address(id);
One–To–Many, Bidirectional

Bidirectional one–to–many associations are very common. The following code shows an example with a Product and a Feature class:

features = new \Doctrine\Common\Collections\ArrayCollection();
    }
}

/** @ORM\Entity */
class Feature {
    // ...
    // Note: The @ORM\JoinColumn is not really necessary in this example, as the defaults would be the same.
    /**
     * @ORM\ManyToOne(targetEntity="Product", inversedBy="features")
     * @ORM\JoinColumn(name="product_id", referencedColumnName="id")
     */
    private $product;
    // ...
}
Generated MySQL Schema:

CREATE TABLE Product (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE Feature (
    id INT AUTO_INCREMENT NOT NULL,
    product_id INT DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE Feature ADD FOREIGN KEY (product_id) REFERENCES Product(id);
One–To–Many, Self-referencing

This example models a hierarchy of categories and from the database perspective is known as an adjacency list approach.

children = new ArrayCollection();
    }
}
The generated MySQL Schema:

CREATE TABLE Category (
    id INT AUTO_INCREMENT NOT NULL,
    parent_id INT DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE Category ADD FOREIGN KEY (parent_id) REFERENCES Category(id);
Many–To–Many, Unidirectional (with Join Table)

Here we have a many–to–many relationship between Users and Groups. A User can ‘belong to’ zero to many groups, which can ‘consist of’ zero to many Users.

groups = new \Doctrine\Common\Collections\ArrayCollection();
    }
}

/** @ORM\Entity */
class Group {
    // ...
}
Generated SQL

CREATE TABLE User (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE users_groups (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY(user_id, group_id)
) ENGINE = InnoDB;

CREATE TABLE Group (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

ALTER TABLE users_groups ADD FOREIGN KEY (user_id) REFERENCES User(id);
ALTER TABLE users_groups ADD FOREIGN KEY (group_id) REFERENCES Group(id);
Note

Note: Real many–to–many associations are not common because frequently you want to associate additional attributes with an association, in which case you introduce an association class. Consequently, the direct many–to–many association disappears and is replaced by one–to–many/many–to–one associations between the three participating classes (although they don’t offer an example of this).

To explain what an association class, also known as a join–table, is, consider online store where orders are placed for products. Each Order contains one or more Products, and each Product is contained in zero or more Orders (zero because we might not have sold any of this product yet). Since the maximum multiplicity in each direction is “many,” this is called a many–to–many association between Orders and Products.

Each time an order is placed for a product, we need to know how many units of that product are being ordered and what price we are actually selling the product for. The sale price might vary from the list price by customer discount, special sale, etc. These attributes are a result of the association between the Order and the Product. We might call this ‘association class’ OrderItem or OrderLine. In UML it is connected to the many–to–many association by a dotted line. If there are no attributes that result from a many–to–many association, there is no association class. See this this or this for the UML.

Many–To–Many, Bidirectional

Here is the same relationship as a bidirectional relationship, in which Groups know of their members in the domain model. Note the separate table ‘user_groups’ allows us to maintain database normalization.

groups = new ArrayCollection();
    }

    // ...
}

/** @ORM\Entity */
class Group {
    // ...
    /**
     * @ORM\ManyToMany(targetEntity="User", mappedBy="groups")
     */
    private $users; // In this case, Groups know who their members are.

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    // ...
}
The generated SQL is the same as the unidirectional version.

To get the Article and Tag many–to–many bidirectional example shown into BCNF, we need an association or join table.

addArticle($this); // synchronously updating inverse side
            $this->tags[] = $tag;
     }

         public function __construct()
     {
            $this->tags = new ArrayCollection;
     }
}
?>

articles = new ArrayCollection;
    }

    public function addArticle(Article $article)
    {
        $this->articles[] = $article;
    }
}
?>
The generated SQL would be

CREATE TABLE article (
  article_id INT AUTO_INCREMENT NOT NULL,
 PRIMARY KEY(article_id)
) ENGINE = InnoDB;

CREATE TABLE article_tags (
 article_id INT NOT NULL,
 tag_id INT NOT NULL,
 INDEX article_tags_article_id_idx (article_id),
 INDEX article_tags_tag_id_idx (tag_id),
 PRIMARY KEY(article_id, tag_id)
) ENGINE = InnoDB;

CREATE TABLE tag (tag_id INT AUTO_INCREMENT NOT NULL,
 PRIMARY KEY(tag_id)
) ENGINE = InnoDB;

ALTER TABLE article_tags ADD FOREIGN KEY (article_id) REFERENCES article(article_id);
ALTER TABLE article_tags ADD FOREIGN KEY (tag_id) REFERENCES tag(tag_id);
Recall, since we decided that the Article class would be responsible for the managing the association between articles and tags. Whenever a new article is added, you want to connect it with existing or with new tags. Your ‘create Article’ form will probably support this notion and allow to specify the tags directly. This is why you should pick the Article as owning side. It makes the code more understandable. Again, this decision decicion allow us to do multiple tag additions using the Article side of the association:

addTag($tagA); // or $article->addTags($tagArray)
$article->addTag($tagB);
Many–To–Many, Self–referencing

You can even have a self–referencing many–to–many association. A common scenario is where a User has friends and the target entity of that relationship is a User, so it is self referencing. In this example it is bidirectional, so User has a field named $myFriends and $areFriendsWithMe, which is the collection of Users who have me as a friend.

friendsWithMe = new \Doctrine\Common\Collections\ArrayCollection();
        $this->myFriends = new \Doctrine\Common\Collections\ArrayCollection();
    }

    // ...
}
Generated MySQL Schema:

CREATE TABLE User (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE friends (
    user_id INT NOT NULL,
    friend_user_id INT NOT NULL,
    PRIMARY KEY(user_id, friend_user_id)
) ENGINE = InnoDB;

ALTER TABLE friends ADD FOREIGN KEY (user_id) REFERENCES User(id);
ALTER TABLE friends ADD FOREIGN KEY (friend_user_id) REFERENCES User(id);
Ordering Collections

To retrieve a sorted collection from the database you can use the @OrderBy annotation with an collection. This causes an DQL ORDER BY ... ASC snippet to be appended to all queries with this collection. You can add @OrderBy to any @OneToMany or @ManyToMany association like this:

 10
However the following:

SELECT u, g FROM User u JOIN u.groups g WHERE u.id = 10
would internally be rewritten to:

SELECT u, g FROM User u JOIN u.groups g WHERE u.id = 10 ORDER BY g.name ASC
Note

Note: You cannot override @OrderBy. You can’t override ASC with DESC. You are stuck with the ordering.

Inheritance

Mapped Superclass

An mapped superclass is an abstract or concrete class that provides persistent entity state and mapping information for its subclasses, but which is not itself an entity. Typically, the purpose of such a mapped superclass is to define common state and mapping information for multiple entity subclasses. It is often abstract.

Mapped superclasses can appear in the middle of an otherwise mapped inheritance hierarchy (through Single Table Inheritance or Class Table Inheritance).

Persistent relationships defined by a mapped superclass must be unidirectional (with an owning side only). This means that One–To–Many assocations are not possible on a mapped superclass at all. Furthermore Many–To–Many associations are only possible if the mapped superclass is only used in exactly one entity at the moment. For further support of inheritance, the single or joined table inheritance features have to be used.

<?php
/** @ORM\MappedSuperclass */
class MappedSuperclassBase {

    /** @ORM\Column(type="integer") */
    private $mapped1;
    /** @ORM\Column(type="string") */
    private $mapped2;
    /**
     * @ORM\OneToOne(targetEntity="MappedSuperclassRelated1")
     * @ORM\JoinColumn(name="related1_id", referencedColumnName="id")
     */
    private $mappedRelated1;

    // ... more fields and methods
}

/** @ORM\Entity */
class EntitySubClass extends MappedSuperclassBase {
    /** @ORM\Id @Column(type="integer") */
    private $id;
    /** @ORM\Column(type="string") */
    private $name;

    // ... more fields and methods
}
Single Table Inheritance

Single Table Inheritance is an inheritance mapping strategy where all classes of a hierarchy are mapped to a single database table. In order to distinguish which row represents which type in the hierarchy a so–called discriminator column is used.

<?php
namespace MyProject\Model;

/**
 * @Entity
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="discr", type="string")
 * @ORM\DiscriminatorMap({"person" = "Person", "employee" = "Employee"})
 */
class Person {
    // ...
}

/**
 * @Entity
 */
class Employee extends Person {
    // ...
}
The @InheritanceType, @DiscriminatorColumn and @DiscriminatorMap must be specified on the topmost class that is part of the mapped entity hierarchy.
The @DiscriminatorMap specifies which values of the discriminator column identify a row as being of a certain type. In the case above a value of “person” identifies a row as being of type Person and “employee” identifies a row as being of type Employee.
The names of the classes in the discriminator map do not need to be fully qualified if the classes are contained in the same namespace as the entity class on which the discriminator map is applied.
Note: This strategy works well with simple, stable hierachies. In many–to–one or one–to–one associations, the “targetEntity” must be a leaf node in the inheritance hierarchy. It must not have subclasses. Otherwise Doctrine CANNOT create proxy instances of this entity and will ALWAYS load the entity eagerly.

Class Table Inheritance

Class Table Inheritance uses one database table per class in the inheritance structure.he table of a child class is linked to the table of a parent class through a foreign key constraint. Doctrine 2 implements this strategy through the use of a discriminator column in the topmost table of the hierarchy because this is the easiest way to achieve polymorphic queries with Class Table Inheritance.

<?php
namespace MyProject\Model;

/**
 * @Entity
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="discr", type="string")
 * @ORM\DiscriminatorMap({"person" = "Person", "employee" = "Employee"})
 */
class Person {
    // ...
}

/** @ORM\Entity */
class Employee extends Person {
    // ...
}
The @InheritanceType, @DiscriminatorColumn and @DiscriminatorMap must be specified on the topmost class that is part of the mapped entity hierarchy.
The @DiscriminatorMap specifies which values of the discriminator column identify a row as being of which type. In the case above a value of “person” identifies a row as being of type Person and “employee” identifies a row as being of type Employee.
The names of the classes in the discriminator map do not need to be fully qualified if the classes are contained in the same namespace as the entity class on which the discriminator map is applied.
In a many–to–one or one–to–one relationships, you can only use leaf node class as the “targetEntity”, those that have no subclasses. Otherwise Doctrine CANNOT create proxy instances of this entity and will ALWAYS load the entity eagerly.

Working with Objects

Unit of Work and Entity State concepts

Once the entity manager returns an object, say, for example, as the result of a find, it still ‘tracks’ any changes made in userland to the object. Doctrine will always return the same instance, no matter how often you retrieve it or what method you use. Doctrine internally knows each entities identity.

The unit of work is really the ORM object analogue of a SQL transaction. A new unit of work is created when the EntityManager is first created or after EntityMananger::flush() or EntityManager::close(). The EntityManager::flush() call commits the current unit of work, and the necessary SQL commands—INSERT, UPDATE or DELETE—are done. EntityManager::clear() will cause the an objects currently being tracked by the EntityManager in memory to be ‘forgotten’. The entity manager will be forced to re–read them from the database. The unit of work starts over.

An entity can be in four states with respect to the entity manager:

MANAGED
REMOVED
DETACHED
NEW
An entity newly created using the new operator, but not yet associated with the entity manager, is considered NEW. Once it is passed to the entity manager on EntityManager::persisit(), it becomes MANAGED. Calling EntityManager::remove() on a entity will result, when flush() is called, in its removal from the database. Calling EntityManager::detach() means the object is still a persistant object, but its changes, if any, are not being tracked by the entity manager.

The downside to EntityManager::find()

Given this entity

comments = new ArrayCollection();
   }

   public function getAuthor() { return $this->author; }
   public function getComments() { return $this->comments; }
}
The call to retrieve the article whose $id is 1:

find('Article', 1);
will return a lazy–load proxy unless the persistent association were marked as EAGER. When get methods are called (termed object traversal), the database will again be accessed to load the class properties, thus affecting performance.

Warning

Traversing the object graph for parts that are lazy–loaded—that is, accessing the elements of ArrayCollection member variables—will easily trigger lots of SQL queries and will perform badly if used too heavily. Prefer DQL fetch–joins to most efficiently retrieve all parts of the object–graph that you need.

To delete an object permanently from persistent storage, you can EntityManager::remove($obj). This will delete the object at the next flush(). If you EntityManager::remove($obj) and the object has an association annotated CASCADE=REMOVE, this can be inefficient for large object graphs. Using the DQL DELETE command is very efficient when deleting large object graphs from the database. DQL DELETE allows you to delete multiple entities of a type without hydrating these entities. The annotation onDelete="CASCADE", which is I believe is a RDMS cascade, is efficient but be aware that CASCADE=REMOVE will cause it to be ignored.

When EntityManager::merge($someEntity) is done, the state of the passed entity will be merged into a managed copy of this entity and this copy will subsequently be returned.

Various Query Techniques

Doctrine 2 provides the following ways, in increasing level of power and flexibility, to query for persistent objects. You should always start with the simplest one that suits your needs.

1. Using EntityManager find methods

1.1 You can find by primary key

find('MyProject\Domain\User', $id);
Recall, find will return a lazy–load proxy. Any associations in the entity that have been mapped as EAGER will be fully loaded. The above code is equivalent to

getRepository('MyProject\Domain\User')->find($id);
1.2 EntityRepositories’ findBy and findOneBy

To query for one or more entities based on several conditions (that will be AND’ed), use the findBy() and findOneBy() methods on a repository as follows:

getRepository('MyProject\Domain\User')->findBy(array('age' => 20));

// All users that are 20 years old and have a surname of 'Miller'
$users = $em->getRepository('MyProject\Domain\User')->findBy(array('age' => 20, 'surname' => 'Miller'));

// A single user by its nickname
$user = $em->getRepository('MyProject\Domain\User')->findOneBy(array('nickname' => 'romanb'));
Again, lazy–load proxies are always returned. Only those associations marked EAGER will be returned fully loaded.

1.3 getReference() enhances performance

The method EntityManager::getReference($entityName, $identifier) lets you obtain a reference to an entity for which the identifier is known, without loading that entity from the database. This is useful, for example, as a performance enhancement, when you want to establish an association to an entity for which you have the identifier.

Here, we add an Item to a Cart without loading the Item from the database using the EntityManager::getReference() method

getReference('MyProject\Model\Item', $itemId);
$cart->addItem($item);
$item here is actually a lazy–load proxy. The item will not be initialized from the database until one of its ‘getter’ methods is called.

3. By DQL

The most powerful and flexible method to query for persistent objects is the Doctrine Query Language (DQL), Doctrine’s object query language DQL enables you to query for persistent objects using an object–based syntax. DQL understands classes, fields, inheritance and associations. DQL is syntactically very similar to the familiar SQL, but it is not SQL. A DQL query is represented by an instance of the Doctrine\ORM\Query class. You create a query using EntityManager::createQuery($dql).

createQuery("select u from MyDomain\Model\User u where u.age >= 20 and u.age getResult();
DQL supports positional as well as named parameters, many functions, fetch joins, aggregates, subqueries and much more. Detailed information about DQL follows. If you need to incrementally create a query using information known at run–time, you can use the QueryBuilder.

4. By Raw SQL

See the chapter on Native SQL.

5. Custom Repositories

By default the EntityManager returns a default implementation of Doctrine\ORM\EntityRepository when you call EntityManager::getRepository($entityClass). The findXXX() methods EntityManager::getRepository($entityClass) are shortcuts for $em->getRepositoy("\MyProject\Entity\User")->find($id). You can override this behaviour by specifying the class name of your own Entity Repository in the Annotation, XML or YAML metadata.

_em->createQuery('SELECT u FROM MyDomain\Model\User u
                                     WHERE u.status = "admin"')
                         ->getResult();
    }
}
The code below is equivalent to that above

getRepository('MyDomain\Model\User')->getAllAdminUsers();
Discusssion of Repositories

TODO: Flesh this out with patterns and examples

Notes on Repository pattern article by Giorgio Sironi. Repository

The domain model consists of your entities and whatever you eventually need to do with them. The repository is supposed to hide the ORM. Ideally, the repository interface is a standalone collection–interface for accessing, deleting and saving a particular entity. It hides the persistence details—the ORM, DQL, QueryBuilders.

In Domain Driven Design, the idea of the repository is that it speaks the language of the domain and the repositories act as mediators between the domain and the data mapping layers. They provide a common language to all team members by translating technical terminology into business terminology.

So a repository is supposed to be a collection interface to the entities. As such, it doesn’t depend on anything external, on the ORM. It’s interface is ignorant of the persistence mechanism. In Domain Driven Design, a repository is only for aggregate roots, entities that are not contained by other entities.

The repository has a simple collection-like interface with methods to retrieve, delete, and add an entity. Update operations are not part of the repository since updating is handled implicitly by the Data Mapper. In Doctrine 2, this occurs when flush is called.

In Doctrine 2, you specify entity repositories like this

<?php
/**
 * @ORM\Entity(repositoryClass="MyProject\UserRepository")
 */
class User {
    //...
}
You could create your own ‘external’ repositories and compose in the entity manager. You could add any necessary collaborator objects in the repository’s constructor.

This is an example of a Doctrine 2 generated repository. Doctrine 2 will instantiate the base EntityRepository passing it the entity’s class name. It will be perfectly functional but it won’t have any domain-specific methods. You then call EntityManager#getRepository.

_em->createQuery('SELECT u FROM MyDomain\Model\User u WHERE u.status = "admin"')
                         ->getResult();
    }
}

getRepository('MyDomain\Model\User')->getAllAdminUsers();
In Doctrine 2 the steps are

extend the abstract class EntityRepository, which has a protected base class member $this->_em that you use to execute queries, if you want to add custom query methods.
add the ‘repositoryClass’ option to the @ORMEntity annotation, supplying a class name for your concrete repository.
obtain an instance of the entity with $em->getRepository(‘EntityClassName’).
Concurrency and Transactions

The Doctrine 2 “Best Practices” states:

“While Doctrine will automatically wrap all DML operations in a transaction on flush(), it is considered best practice to explicitly set the transaction boundaries yourself. Otherwise every single query is wrapped in a small transaction (Yes, SELECT queries, too) since you can not talk to your database outside of a transaction. While such short transactions for read-only (SELECT) queries generally don’t have any noticeable performance impact, it is still preferable to use fewer, well-defined transactions that are established through explicit transaction boundaries.”_

PDO operates by default in auto-commit mode: every single statement in wrapped in a small transaction. But without any explicit transaction demarcation by the programmers, this quickly results in poor performance because transactions are not cheap.

Doctrine 2’s default transaction demarcation is to queue all write operations—INSERT, UPDATE, DELETE—until EntityManager#flush() is invoked, which wraps all these changes in a single transaction. The typical pattern is something like

setName('George');
$em->persist($user);
$em->flush();
Note: if an exception occurs during EntityManager::flush(), the transaction is automatically rolled back and the EntityManager closed. However, you can take control of transaction demarcation yourself. There are two ways to do this. First technique, using EConnection::beginTransaction():

getConnection()->beginTransaction(); // suspend auto-commit
try {
    //... do some work
    $user = new User;
    $user->setName('George');
    $em->persist($user);
    $em->flush();
    $em->getConnection()->commit();

} catch (Exception $e) {

    $em->getConnection()->rollback();
    $em->close();
    throw $e;
}
Second, EntityManager::transactional():

transactional(function($em) {
    //... do some work
    $user = new User;
    $user->setName('George');
    $em->persist($user);
});
Here the commit and rollback is done implicitly. If an exception is thrown during transactional(), a rollback will be done and the entity manager will be close. You must therefore, re-create the entity manager if you intend to use the ORM to interact with the database.

Conceptual or Long-Running Transactions

A long-running “business transaction”, one that spans multiple HTTP requests, cannot be controlled by SQL transactions because transactions are only valid during a single HTTP requests. In such situations, concurrency control becomes the partial responsibility of the application itself. For situations in which an entity needs to be protected against concurrent modifications during long-running business transactions, the entity gets a version field that is either a simple number (mapping type: integer) or a timestamp (mapping type: datetime). When changes to such an entity are persisted at the end of a long-running conversation, the version of the entity is compared to the version in the database and if they don’t match, an OptimisticLockException is thrown, indicating that the entity has been modified by someone else already.

This philosophy of optomistic locking is excerpted from Scott Ambler’s Introduction to Concurrency Control:

“With multi-user systems it is quite common to be in a situation where collisions are infrequent. Although the two of us are working with Customer objects, you’re working with the Wayne Miller object while I work with the John Berg object and therefore we won’t collide. When this is the case optimistic locking becomes a viable concurrency control strategy. The idea is that you accept the fact that collisions occur infrequently, and instead of trying to prevent them you simply choose to detect them and then resolve the collision when it does occur.”

To explain how optimistic locking works consider two separate users of the ORM. User A reads object X, which has a @ORMVersion property. When A retrieves X from the data, its version property is read and remembered. If User B later reads X, it too retrieves the version property. If B persists X before A, the changes will be saved to the database. If A later tries to save X, the UPDATE will fail because the version number will have changed. The actual SQL will include a WHERE clause that checks the version number, something like:

UPDATE table_x as x SET x1=new_x1, version=new_version WHERE x.version=old_version;
When A goes to save X, when flush() is called, the UPDATE will fail because the version has changed. This will result in an OptimisticLockException being thrown. Note: The ORM users is responsible for saving the ‘version’ property so it persists between HTML requests. This can be done by saving it in an HTML form as a hidden value or saving it in the browser session.

To get the “conceptual write lock”, you have to use the four parameter version of EntityManager#find. It will throw an OptimisticLockException, if the expected value in the fourth parameter is not found. The same is true when flush() is called: if the ‘version’ property has changed, say, by another user, then flush() too will throw an OptimisticLock exception, if you used the four parameter-version of find() to lock the entity.

This is an example of using Optimistic Locking in Doctrine 2. Here we using optomistic locking with a blog post. The ‘version’ property will be automatically updated by Doctrine 2 when the updated object is again written to the database.



find('BlogPost', $postid);

  /* Create and display html form including values of 'blog_id' and
  'version' */
   // . . .
   echo 'getId() . '" />';

   echo 'getCurrentVersion() . '" />';

} else { /* process the form */

 $blogpostId = (int) $_POST['id'];
 $blogpost_expectedVersion = (int) $_POST['version'];

  try {

    // The four-parameter version of find() will throw
    // OptimisticLockException if the version is not the expected version.
    $entity = $em->find('Entities\User',
               $blogpostid,
               LockMode::OPTIMISTIC,
               $blogpost_expectedVersion);

    // do the work, changing the object's properties
    // ....
    // If flush() detects a different version, it will throw an
    $em->flush();

} catch(OptimisticLockException $e) {
    echo "Sorry, but someone else has already changed this entity resulting in an updated
    version number that differs from the version that was read and either saved in the form as
    a hidden value or save in the browser session (so it will persist between HTML requests).
       Please apply the changes again!";
}
DQL

Imagine all your objects lying around in some storage (like an object database). When writing DQL queries, think about querying that storage to pick a certain subset of your objects. DQL is a query language for your object model, not for your relational schema. This retrieval and setting of an entities non–scalar properties is termed hydration.

DQL as a query language has SELECT, UPDATE and DELETE constructs that map to their corresponding SQL statement types. INSERT statements are not allowed in DQL, because entities and their relations have to be introduced into the persistence context through EntityManager#persist() to ensure consistency of your object model.

SELECT Queries

DQL SELECT statements are a very powerful way of retrieving parts of your domain model that are not accessible via associations. Additionally, since DQL statements allow you to retrieve entities and their associations in one single sql select statement, this can make a huge difference in performance by eliminating the need for several queries.

The DQL FROM clause must contain the fully–qualified class name followed by an identification variable or alias for that class name. For example

newDefaultAnnotationDriver(array(*DIR*."/Entities"));
/* snip . . . */

$query = $em->createQuery('SELECT u FROM Entities\User u WHERE u.age > 20');
$users = $query->getResult();
The SELECT clause allow you to specify both class identification variables that signal whether to fetch a complete entity class u or whether to fetch just fields of the entity using the syntax u.name. Furthermore, combinations of both are allowed.

For example, to select just a property of an object

createQuery('SELECT u.id FROM \MyProject\Model\CmsUser u');
$ids = $query->getResult(); // array of CmsUser ids
This selects all CmsUser ids.

JOINs

A join (be it an inner or outer join) becomes a “fetch join” as soon as fields of the joined entity appear in the SELECT part of the DQL query outside of an aggregate function. Otherwise its a “regular join”. Below is a regular JOIN.

createQuery("SELECT u FROM User u JOIN u.address a WHERE a.city = 'Berlin'");
$users = $query->getResult();
A regular join is used to limit the results and/or compute aggregate values. We had to JOIN User with Address in order to get all Users located in Berlin. In a regular join, properties of an entity that reside in separate tables, like the User’s Address above, are not retreived and loaded into in the result objects. Instead these properties are replaced with lazy–load proxies. In a regular join we are purely interested in getting the limited set of Users who reside in Berlin. In order to select these Users, we must join User with its property u.address. In DQL, we cannot refer directly to the city property of the User’s address with syntax like this

SELECT u FROM User u WHERE u.a.city = 'Berlin';
In SQL, you would have to JOIN the accounts and address tables

<?php
SELECT u.*, a.* FROM accounts u INNER JOIN address a ON u.address_id=a.address_id WHERE a.city = 'Berlin'
and then use the WHERE projection operator; likewise, in DQL, we must do a DQL regular join.

createQuery("SELECT u FROM User u JOIN u.address a WHERE a.city = 'Berlin'");
Prefer Fetch Joins to tranversing associations between objects

Fetch joins help improve performance be eliminating the many small queries that occur when accessing the associations. For example, the query

createQuery("SELECT u, a FROM User u JOIN u.address a WHERE a.city = 'Berlin'");
$users = $query->getResult();
returns both Users and their respective address(es) property, for those Users residing in Berlin. The Address is hydrated into (loaded into) the User::address property. Later lazy–loading of address is avoided, and performance is thus improved. If had done a regular join

createQuery("SELECT u FROM User u JOIN u.address a WHERE a.city = 'Berlin'");
$users = $query->getResult();
or simplier still a find(), assuming we knew the userid

find("Entities\User", $id);
and then called

getAddress()
$address would have been initialized with a lazy–load proxy. If we called a get method of Address

getCity();
a query would be issued to initialize the properties of $address. If a class has a collection–based association, the collection will be fully loaded when it is first accessed. If it has several collections, each will be fully loaded in turn only when it is first accessed.

Tip

Fetch Joins are the solution to hydrate most or all of the entities that you need in a single SELECT query. Again, a join—be it an inner or outer join—becomes a “fetch join” as soon as fields of the joined entity appear in the SELECT part of the DQL query outside of an aggregate function; otherwise its a “regular join”.

This next query returns an array of FormUser objects with its associated avatar property set. Lazy–loading, which would ordinarily occur when accessing the avatar property, is eliminated. Since the avatar is a separate entity, stored in a separate table, and not simply a scalar, we need to do a fetch JOIN. We are not returning two separate objects. Instead the avatar property of each FormUser object is set. We say that the FormUser has been hydrated with its avatar.

createQuery('SELECT u, a FROM MyProject\Model\ForumUser u JOIN u.avatar a');
$users = $query->getResult(); // array of ForumUser objects with the avatar association wll already be loaded
echo get_class($users[0]->getAvatar());
Retrieve a CmsUser and fetch join all his associated phone numbers. This is a fetch join.

createQuery('SELECT u, p FROM MyProject\Model\CmsUser u JOIN u.phonenumbers p');
$users = $query->getResult(); // array of CmsUser objects with the phonenumbers association loaded
$phonenumbers = $users[0]->getPhonenumbers();
Now, when getPhonenumbers() is called, no lazy–loading will occur, no further query will be issued. The phonenumbers collection will already have been filled. The phonenumbers will be hydrated into their respective CmsUsers.

Retrieve all User entities:

createQuery('SELECT u FROM MyProject\Model\User u');
$users = $query->getResult(); // array of User objects
Note: This returns an array of lazy–load proxies. Any associations/collections will not be loaded.

Retrieve the IDs of all CmsUsers:

createQuery('SELECT u.id FROM MyProject\Model\CmsUser u');
$ids = $query->getResult(); // array of CmsUser ids
Here an ordinary array is returned, filled with ‘id’ values.

Retrieve the IDs of all users that have written an article:

createQuery('SELECT DISTINCT u.id FROM MyProject\Model\CmsArticle a JOIN a.user u');
$ids = $query->getResult(); // array of CmsUser ids
Again, an ordinary array is returned, filled with ‘id’ values.

Retrieve all articles and sort them by the name of the article’s author property. First the entities invovled:

author; }
    public function getId() { return $this->id; }

    public function getComments()
    {
      return $this->comments;
    }

    public function __construct()
    {
         $this->comments = new ArrayCollection();
    }

   public function __toString()
   {
       $html = "CmsArticle::id = " . $this->getId() . "  
\n";
       $html .= "CmsArticle::author [We return only the author's id] = " .
                 $this->getAuthor()->getId() . "  
\n";

       $html .= "CmsArticle::topic = " . $this->getTopic() . "  
\n";
       $html .= "CmsArticle::comments = " . $this->getComments() . "  
\n";
   }
} // end class CmsArticle

getComment();
       return $html;
   }

   public function getAuthoer()
   {
      return $this->author;
   }

   public function setAuthor(CmsUser $user)
   {
      $this->author = $user;
   }

   public function setComment($text)
   {
         $this->comment = $test;
   }

   public function getComment()
   {
      return $this->comment_text;
   }
} // end class CmsArticleComment

articles = new ArrayCollection();
       $this->phonenumbers = new ArrayCollection();
       $this->groups = new ArrayCollection();
    }

    public function getName() { return $this->name; }
    public function getUsername() { return $this->username; }
    public function getArticles() { return $this->articles; }
    public function getPhonenumbers() { return $this->phonenumbers; }
    public function getId() { return $this->id; }

    public function __toString()
    {
        $html =  "CmsUser::name = " . $this->getName() . "  
\n";
        $html .=   "CmsUser::username = " . $this->getUsername() . "  
\n";
        $html .=   "CmsUser::articles[] =   
";

        foreach($this->articles as $article) {

            $html .=  ' ' . $article . "  
\n";
        }

        $html .=   "CmsUser::phonenumbers[] = ";

        foreach($this->phonenumbers as $phonenumber) {

            $html .=   $phonenumber . "  
\n";
        }
         return $html;

    }
} // end class CmsUser

/** file: Entities/Phonenumber.php
 * @Entity
 * @ORM\Table(name="phonenumber")
*/
class Phonenumber {
    /**
    *  @ORM\Id
    *  @ORM\Column(type="integer", name="phone_id")
    *  @GeneratedValue
    */
    protected $id;
    /**
    *  @ORM\Column(type="string", name="name", length="10")
    */
    protected $phonenumber;

} // end class Phonenumber

/** file: Entities/Group.php
 * @Entity
 * @ORM\Table(name="group")
*/
class Group {
    /**
    *  @ORM\Id
    *  @ORM\Column(type="integer", name="group_id")
    *  @GeneratedValue
    */
    protected $id;

    /**
    *  @ORM\Column(type="string", name="name", length="255")
    */
    protected $groupname;

    /**
     * Inverse Side
     * A group has 0 to many members. A member 'belongs to' 0 to many groups.
     *
     * @ORM\ManyToMany(targetEntity="User", mappedBy="groups")
     */
    protected $members;

    public function getId() { return $this->id; }
    public function getGroupname() { return $this->groupname; }
    public function setGroupname() { $this->groupname = $groupname; }
?>
This is the sql that corresponds to doing: doctrine orm: schema-tool:create --dump-sql > cms.sql:

-- cms.sql roughly equivalent to doing: doctrine orm:schema-tool:create --dump-sql > cms.sql
create table if not exists account (
    account_id int(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (account_id)
) ENGINE=InnoDB;

create table if not exists article (
    article_id int(11) NOT NULL AUTO_INCREMENT,
    author_id int(11) DEFAULT NULL,
    content text NOT NULL,
    primary key (article_id)
) ENGINE=InnoDB;

create table if not exists phonenumber (
    phone_id int(11) NOT NULL AUTO_INCREMENT,
    phonenumber varchar(10) NOT NULL,
    PRIMARY KEY (phone_id)
) ENGINE=InnoDB;

create table if not exists phone_users (
    user_id  int(11) NOT NULL,
    phone_id int(11) NOT NULL,
    primary key (user_id, phone_id)
) ENGINE=InnoDB;

alter table article add foreign key (author_id) references account (account_id);
alter table phone_users add foreign key (user_id) references account (account_id);
alter table phone_users add foreign key (phone_id) references phonenumber (phone_id);
Finally, the actual query to retrieve all articles in ASC order by the name of the article’s author property. This is a regular join.

createQuery('SELECT a FROM MyProject\Model\CmsArticle a JOIN a.user u ORDER BY u.name ASC');
$articles = $query->getResult(); // array of CmsArticle objects
$articles is an array of lazy–load proxies. The calls $article->getAuthor()->getName() below

getId() . ", User Name: " ,  $article->getAuthor()->getName() . "  
\n";
}
to get the author’s name will triger another database access each time. To avoid this do a fetch join

createQuery('SELECT a, u FROM MyProject\Model\CmsArticle a JOIN a.author u ORDER BY u.name ASC');
which will load the CmsArticle::author instance variable in each element of the array.

Retrieve the Username and Name of CmsUser:

createQuery('SELECT u.username, u.name FROM MyProject\Model\CmsUser u');
$users = $query->getResults(); // returns an array consisting of CmsUser username and id values
echo $users[0]['username'];
The above query returns an associative array with keys of ‘username’ and ‘name’.

Retrieve a ForumUser and his single associated entity:

createQuery('SELECT u, a FROM MyProject\Model\ForumUser u JOIN u.avatar a');
$users = $query->getResult(); // array of ForumUser objects with the avatar association loaded
echo get_class($users[0]->getAvatar());
Since the User’s avatar property is not a scalar and is located in a different table, the fetch JOIN insures the avatar property of the FormUser will already be loaded.

Retrieve a CmsUser and “fetch join” all the phonenumbers he has:

createQuery('SELECT u, p FROM MyProject\Model\CmsUser u JOIN u.phonenumbers p');
$users = $query->getResult(); // array of CmsUser objects with the phonenumbers association loaded
$phonenumbers = $users[0]->getPhonenumbers();
Again, the phone number is not a scalar. It resides in a separate table. Therefore, the JOIN is necessary to insure that the phone number is already loaded when the results are returned. Lazy–loading will not occur when $users[0]->getPhonenumbers() is called.

Return results in Ascending order:

createQuery('SELECT u FROM MyProject\Model\ForumUser u ORDER BY u.id ASC');
$users = $query->getResult(); // array of ForumUser objects
The $users array will ordered by the ForumUser::id property. $users[0] will have the smallest FormUser::id value, $users[1] the next smallest, and so on.

Or in Descending Order:

createQuery('SELECT u FROM MyProject\Model\ForumUser u ORDER BY u.id DESC');
$users = $query->getResult(); // array of ForumUser objects
Again, the $users array will ordered by the ForumUser::id property. $users[0] will have the largest FormUser::id value, $users[1] the next smallest, and so on.

Using Aggregate Functions:

createQuery('SELECT COUNT(u.id) FROM Entities\User u');
$count = $query->getSingleScalarResult();
The above is equivalent to the MySQL SELECT COUNT(account_id) as user_count FROM users GROUP BY account_id.

With WHERE Clause and Positional Parameter:

createQuery('SELECT u FROM MyProject\Model\ForumUser u WHERE u.id = ?1');
$query-> $query->setParameter(1, 3);  // set ?1 to 3
$users = $query->getResult(); // array of ForumUser objects
With WHERE Clause and Named Parameter:

createQuery('SELECT u FROM MyProject\Model\ForumUser u WHERE u.username = :name');
$query->setParameter('name', 'jwage'); // set :name to 'jwage'
$users = $query->getResult(); // array of ForumUser objects
With Nested Conditions in WHERE Clause:

createQuery('SELECT u from MyProject\Model\ForumUser u WHERE
             (u.username = :name OR u.username = :name2) AND u.id = :id');
 // set named parameters
$query->setParameters(array('name' => 'jwage', 'name2' => 'beberlei', 'id' => 4));
$users = $query->getResult(); // array of ForumUser objects
The above is just like PDO.

COUNT with DISTINCT:

createQuery('SELECT COUNT(DISTINCT u.name) FROM MyProject\Model\CmsUser');
$users = $query->getResult(); // array of ForumUser objects
With Arithmetic Expression in WHERE clause:

createQuery('SELECT u FROM MyProject\Model\CmsUser u WHERE ((u.id + 5000) * u.id + 3) getResult(); // array of ForumUser objects
The above would be equivalent to the MySQL ‘SELECT acc.* from accounts as acc where ((acc.id + 500) * acc.id +3) < 10000000’.

Using a LEFT JOIN to hydrate (retrieve) all user–ids and, if they also exist, their associated article–ids:

createQuery('SELECT u.id, a.id as article_id FROM
                  MyProject\Model\CmsUser u LEFT JOIN u.articles a');
$results = $query->getResult(); // array of user ids and every article_id for each user
Recall, a LEFT JOIN returns all rows in the left hand table of the JOIN. In this case the underlying table for CmsUser objects will be LEFT JOIN’ed with the underlying table for the Article objects. A JOIN is necessary because the CmsUser::articles collection resides in a different table. If a CmsUser has not authored an article, its $results array element will have an ‘id’ key but not an ‘article_id’ key. So a print_r() of each result

<?php
foreach($results as $id_pair) { print_r($id_pari); echo "  
-----  
\n"; }
might display like this

Array ( [id] => 1 [article_id] => 2 )
~~~~~~
Array ( [id] => 2 [article_id] => 1 )
~~~~~~
Array ( [id] => 3 [article_id] => )
This is an analogous query that uses the entities from the Cookbook tutorial:

$query = $em->createQuery('SELECT u.id, b.id as article_id FROM
                   Entities\User u LEFT JOIN u.reportedBugs b');
Restricting a JOIN clause by additional conditions:

createQuery("SELECT u FROM MyProject\Model\CmsUser u
                         LEFT JOIN u.articles a WITH a.topic LIKE '%foo%'");
$users = $query->getResult();
Comment: The DQL syntax ‘entity LEFT JOIN entity.property WITH...LIKE...’ as in

SELECT u FROM Entities\User u LEFT JOIN u.articles a WITH a.topic LIKE '%port%'
generates this SQL:

SELECT u0_.user_id AS user_id0,
       u0_.name AS name1,
       u0_.username AS username2 FROM
           user u0_
                LEFT JOIN
                    article a1_ ON u0_.user_id = a1_.author_id AND (a1_.topic LIKE '%port%')
Note, it will always include all rows of CmsUser. If we call the getArticles() method of CmsUser

getArticles();
the collection returned will be empty whenever the article’s topic was not LIKE ‘%port%’. The same thing applies if we hydrate the articles into the CmsUser.

createQuery("SELECT u,a FROM MyProject\Model\CmsUser u LEFT JOIN
                          u.articles a WITH a.topic LIKE '%foo%'");
$users = $query->getResult();
Again, the CmsUser::articles array will be empty whenever the article’s topic is not LIKE ‘%foo%’. The actual SQL output of including all columns of both tables

SELECT u.*, a.*
           FROM user u
           LEFT JOIN
               article a ON u.user_id = a.author_id AND (a.topic LIKE '%port%')
would be

user_id	name	username	article_id	author_id	topic
1	kurt kemp	kurtk	NULL	NULL	NULL
2	bill jones	bjones	1	2	sports
3	tom smith	tsmith	NULL	NULL	NULL
This DQL “SELECT u FROM EntitiesUser u LEFT JOIN u.articles a WHERE a.topic LIKE ‘%port%’” generates this SQL:

SELECT u0_.user_id AS user_id0,
       u0_.name AS name1,
       u0_.username AS username2 FROM
           user u0_
               LEFT JOIN
                   article a1_ ON u0_.user_id = a1_.author_id
               WHERE a1_.topic LIKE '%port%'
If we alter it to include all columns of both tables

SELECT u.*, a.*
           FROM user u
           LEFT JOIN
               article a ON u.user_id = a.author_id
           WHERE a.topic LIKE '%port%'
the SQL output is

user_id	name	username	article_id	author_id	topic
2	bill jones	bjones	1	2	sports
Using several Fetch JOINs:

createQuery('SELECT u, a, p, c FROM MyProject\Model\CmsUser u JOIN u.articles a JOIN u.phonenumbers p JOIN a.comments c');
$users = $query->getResult();
Again, the JOIN retrieves non–scalar properties of CmsUser that reside in separate tables. The JOIN insures that the CmsUser’s articles, phonenumbers, and comments are retrieved, so lazy–loading of these properties is avoided and performance is not later degraded.

Note, the query above hydrates not only the CmsUser with its associated articles and phonenumbers, but it hydrates the comments with its associated articles.

Query all Users. Include in the User results their associated assigned and reported bugs, and for each of these bug collections within User, load its product collection.

$query = $em->createQuery('SELECT u, b, p FROM Entities\User u LEFT JOIN u.reportedBugs b JOIN b.products p');
BETWEEN in a WHERE clause:

createQuery('SELECT u.name FROM MyProject\Model\CmsUser u WHERE u.id BETWEEN ?1 AND ?2');
 // set ?1 and ?2 to 2 and 4, respectively
$query->setParameters(array(1 => 2, 2 => 4));
$usernames = $query->getResult();
BETWEEN is used exactly like the SQL.

Other DQL Functions in WHERE clause, like TRIM():

createQuery("SELECT u.name FROM MyProject\Model\CmsUser u
                           WHERE TRIM(u.name) = 'someone'");
$usernames = $query->getResult();
IN() Expression:

createQuery('SELECT u.name FROM MyProject\Model\CmsUser u WHERE u.id IN(46)');
$usernames = $query->getResult();

$query = $em->createQuery('SELECT u FROM MyProject\Model\CmsUser u WHERE u.id IN (1, 2)');
$users = $query->getResult();

$query = $em->createQuery('SELECT u FROM MyProject\Model\CmsUser u WHERE u.id NOT IN (1)');
$users = $query->getResult();
CONCAT() DQL Function:

createQuery("SELECT u.id FROM MyProject\Model\CmsUser u WHERE CONCAT(u.name, 's') = ?1");
$query-> $query->setParameter(1, 'jwage');  // set ?1 to 'Wage'
$ids = $query->getResult();

$query = $em->createQuery('SELECT CONCAT(u.id, u.name) FROM MyProject\Model\CmsUser u WHERE u.id = ?1');
$query-> $query->setParameter(1, 'jwage');  // set ?1 to 'Wage'
$idUsernames = $query->getResult();
CONCAT()‘s usage has the same intuitively obvious usage as in MySQL. This same comment applies to the usage of IN and NOT IN above.

EXISTS in WHERE clause with correlated Subquery

createQuery('SELECT u.id FROM MyProject\Model\CmsUser u WHERE EXISTS (SELECT p.phonenumber FROM CmsPhonenumber p WHERE p.user = u.id)');
$ids = $query->getResult();
Comment: This syntax is the same as MySQL, where EXISTS is applied to a subquery. See Simply SQL for a thorough explanation.

WHERE ... MEMBER OF

Get all users who are members of $group using setParameter().

createQuery('SELECT u.id FROM MyProject\Model\CmsUser u WHERE :groupId MEMBER OF u.groups');
$query->setParameter('groupId', $groupId);
$ids = $query->getResult();
print_r($ids);
The DQL above, when $groupId is 2, interally generates internally generates this SQL

SELECT u.user_id AS user_id0 FROM user u
    WHERE EXISTS
              (SELECT 2 FROM
                           group_members
                              INNER JOIN
                                groups
                                     ON group_members.group_id = groups.group_id
                           WHERE group_members.user_id = u.user_id AND groups.group_id = ?)
and print_r($ids) is

Array ( [0] => Array ( [id] => 1 ) )
Get all users that have more than 1 phonenumber

createQuery('SELECT u FROM MyProject\Model\CmsUser u WHERE SIZE(u.phonenumbers) > 1');
$users = $query->getResult();
The query above internally generate this SQL, which uses COUNT() in a subquery

SELECT u0_.user_id AS user_id0, u0_.name AS name1, u0_.username AS username2
     FROM user u0_
       WHERE (SELECT COUNT(*) FROM phone_users p1_ WHERE p1_.user_id = u0_.user_id) > 1
Get all users that have no phonenumber

createQuery('SELECT u FROM MyProject\Model\CmsUser u WHERE u.phonenumbers IS EMPTY');
$users = $query->getResult();
The query above internally generate this SQL. Again, COUNT() is employed in a subquery

SELECT u0_.user_id AS user_id0, u0_.name AS name1, u0_.username AS username2
      FROM user u0_ WHERE (SELECT COUNT(*) FROM phone_users p1_ WHERE p1_.user_id = u0_.user_id) = 0
Query for inheritance. INSTANCE OF and NOT INSTANCE OF are exactly analagous to PHP’s instanceof() function.

createQuery('SELECT u FROM Doctrine\Tests\Models\Company\CompanyPerson u
                       WHERE u INSTANCE OF Doctrine\Tests\Models\Company\CompanyEmployee');
$query = $em->createQuery('SELECT u FROM Doctrine\Tests\Models\Company\CompanyPerson u
                       WHERE u INSTANCE OF ?1');
$query = $em->createQuery('SELECT u FROM Doctrine\Tests\Models\Company\CompanyPerson u
                       WHERE u NOT INSTANCE OF ?1');
Named and Positional Parameters

Like PHP’s PDO support for prepared statements, DQL can also use positional or name parameters. First, a PHP PDO example of positional parameters:

prepare("INSERT INTO REGISTRY (name, value) VALUES (:name, :value)");
$stmt->bindParam(':name', $name);
$stmt->bindParam(':value', $value);

// insert one row
$name = 'one';
$value = 1;
$stmt->execute();

// insert another row with different values
$name = 'two';
$value = 2;
$stmt->execute();
?>
Next PDO positional parameters:

prepare("INSERT INTO REGISTRY (name, value) VALUES (?, ?)");
$stmt->bindParam(1, $name);
$stmt->bindParam(2, $value);

// insert one row
$name = 'one';
$value = 1;
$stmt->execute();

// insert another row with different values
$name = 'two';
$value = 2;
$stmt->execute();
?>
DQL supports both named and positional parameters, however in contrast to many SQL dialects positional parameters are specified with numbers, for example “?1”, “?2” and so on. Named parameters are specified with “:name1”, “:name2” and so on. Some examples.

createQuery('SELECT u FROM ForumUser u WHERE u.id = ?1');
$query->setParameter(1, $value)
$users = $query->getResult(); // array of ForumUser objects
Partial Object Syntax

By default when you run a DQL query in Doctrine and select only a subset of the fields for a given entity, you do not receive objects back. Instead, you receive only arrays as a flat rectangular result set, just like you you would if you were using SQL.

If you want to SELECT partial objects you can use the partial DQL keyword:

createQuery('SELECT partial u.{id, username} FROM CmsUser u');
$users = $query->getResult(); // array of partially loaded CmsUser objects
You use the partial syntax when joining as well:

createQuery('SELECT partial u.{id, username}, partial a.{id, name} FROM CmsUser u JOIN u.articles a');
$users = $query->getResult(); // array of partially loaded CmsUser objects
UPDATE queries

DQL not only allows to select your Entities using field names, you can also execute bulk updates on a set of entities using an DQL–UPDATE query. The Syntax of an UPDATE query works as expected, as the following example shows:

UPDATE MyProject\Model\User u SET u.password = 'new' WHERE u.id IN (1, 2, 3)
References to related entities are only possible in the WHERE clause and using sub–selects.

Warning

DQL UPDATE statements are ported directly into a Database UPDATE statement and therefore bypass any locking scheme and do not increment the version column. Entities that are already loaded into the persistence context will NOT be synced with the updated database state. It is recommended to call EntityManager#clear() and retrieve new instances of any affected entity.

Iterating Large Result Set Queries

There are situations when a query you want to execute returns a very large result–set that needs to be processed. All the previously described hydration modes completely load a result–set into memory which might not be feasible with large result sets. See the Batch Processing section on details how to iterate large result sets.

createQuery('select u from MyProject\Model\User u');

$iterableResult = $q->iterate();

foreach($iterableResult AS $row) {

    $user = $row[0];

    $user->increaseCredit();

    $user->calculateNewBonuses();

    if (($i % $batchSize) == 0) {

        $em->flush(); // Executes all updates.
        $em->clear(); // Detaches all objects from Doctrine!
    }
    ++$i;
}
Note: Iterating results is not possible with queries that fetch–join a collection–valued association. The nature of such SQL result sets is not suitable for incremental hydration.

DELETE queries

DELETE queries can also be specified using DQL and their syntax is as simple as the UPDATE syntax:

DELETE MyProject\Model\User u WHERE u.id = 4
The same restrictions apply for the reference of related entities.

Warning

DQL DELETE statements are ported directly into a Database DELETE statement and therefore bypass any checks for the version column if they are not explicitly added to the WHERE clause of the query. Additionally Deletes of specifies entities are NOT cascaded to related entities even if specified in the metadata.

The way to permanent delete an entity from the database is to call EntityManager::remove()

getRespository('Entities\User')->find(array('name' => 'jwage'));

$em->remove($user); // schedule for deletion
$em->flush();       // issue delete
Hydration modes

There several different ways in which query results can be returned or hydrated.

getResult() by default returns objects. You can pass in one of there hydration mode parameters: HYDRATE_OBJECT, HYDRATE_ARRAY, HYDRATE_SCALAR or HYDRATE_SINGLE_SCALAR.
getArrayResult() gets the result as an array.
getScalarResult() gets the scalar results of the query.
getSingleScalarResult() gets the single result of the query as a scalar. Use this when get the result of an aggregate function.
Functions, Operators, Aggregates

THIS IS NOT DONE. Was this done above?

Query Builder

Query Builder is an alternative to DQL. It provides a fluent interface for building queries. QueryBuilder helper methods are considered the standard way to build DQL queries. Query Builder is analogous to the fluent interface provided by Zend Framework.

Use Query Builder when you need to build queries based on conditions that are only know at runtime.

Bulk Operation Examples

Bulk inserts in Doctrine are best performed in batches, taking advantage of the transactional write–behind behavior of an entityManager. This will also keep the memory footprint small. The following code shows an example for inserting 10000 objects with a batch size of 20. You may need to experiment with the batch size to find the size that works best for you. Larger batch sizes mean more prepared statement reuse internally, which is good, but also means more work during flush.

To keep the memory footprint small when doing bulk operations, you should call flush after a fixed number of steps.

Bulk Insert Examples

<?php
$batchSize = 20;
for ($i = 1; $i setStatus('user');
        $user->setUsername('user' . $i);
        $user->setName('Mr.Smith' . $i);

        $em->persist($user);

        if ($i % $batchSize == 0) {
            $em->flush();

        $em->clear(); // Detaches all objects from Doctrine. The unit of work starts over.
    }
}
This bulk insert example uses the Bisna package, which integrations Doctrine 2 and Zend Framework. It uses a Country entity class that represents the ISO 3166 list of countries available at http://www.iso.org/iso/iso_3166-1_en_xml.zip:

getEntityManager();

$xml = simplexml_load_file('./countries.xml');

$batchSize = 20;
$count = 0;

try {

        foreach ($xml->children() as $object) {

            $country = new Country($object->{'ISO_3166-1_Country_name'},
                               $object->{'ISO_3166-1_Alpha-2_Code_element'});

                $em->persist($country);

                if ($count % $batchSize == 0) {

                        $em->flush();
                        $em->clear(); // Detaches all objects from Doctrine!
                }

        $count++;
        }

    } catch(Exception $e) {

                echo $e->getMessage();
        return;
}
Bulk Update Example

By far most efficient way for bulk updates is to use a DQL UPDATE query, for example:

createQuery('update MyProject\Model\Manager m set m.salary = m.salary * 0.9');
$numUpdated = $q->execute();
An alternative solution for bulk updates is to use the Query#iterate() to iterate over the query results step by step instead of loading the whole result into memory at once, which occurs during execute. TODO: What actually happens during an UPDATE? Compare it with SQL. The following example shows how to do this, combining the iteration with the batching strategy that was already used for bulk inserts:

createQuery('select u from User u');
$iterableResult = $q->iterate();

foreach($iterableResult AS $row) {

    $user = $row[0];
    $user->increaseCredit();
    $user->calculateNewBonuses();

    if (($i % $batchSize) == 0) {
            $em->flush(); // Executes all updates.
            $em->clear(); // Detaches all objects from Doctrine. Restarts unit of work.
    }
    ++$i;
}
Note: Iterating results is not possible with queries that fetch|ndash|join a collection|ndash|valued association. The nature of such SQL result sets is not suitable for incremental hydration.

Bulk Delete Example

There are two possibilities for bulk deletes with Doctrine. You can either issue a single DQL DELETE query or you can iterate over results removing them one at a time. By far most efficient way for bulk deletes is to use a DQL DELETE query. For example

createQuery('delete from MyProject\Model\Manager m where m.salary > 100000');
$numDeleted = $q->execute();
An alternative solution for bulk deletes is to use the Query#iterate() facility to iterate over the query results step by step instead of loading the whole result into memory at once. The following example shows how to do this

createQuery('select u from User u');
$iterableResult = $q->iterate();

while (($row = $iterableResult->next()) !== false) {

    $em->remove($row[0]);

    if (($i % $batchSize) == 0) {

        $em->flush(); // Executes all deletions.
        $em->clear(); // Detaches all objects from Doctrine! Restarts unit of work.
    }

    ++$i;
}
Note: Again, iterating results is not possible with queries that fetch–join a collection–valued association.

Alternative Delete technique: iterate results

An alternative solution for bulk deletes is to use the Query#iterate() facility to iterate over the query results step by step instead of loading the whole result into memory at once. The following example shows how to do this:

createQuery('select u from MyProject\Model\User u');

$iterableResult = $q->iterate();

while (($row = $iterableResult->next()) !== false) {

    $em->remove($row[0]);

    if (($i % $batchSize) == 0) {

        $em->flush(); // Executes all deletions.
        $em->clear(); // Detaches all objects from Doctrine! Restarts Unit of Work.
    }
    ++$i;
}
Attention

Iterating results is not possible with queries that fetch–join a collection–valued association. The nature of such SQL result sets is not suitable for incremental hydration.

Change Tracking

Since Doctrine can’t know what in an entity has changed, it needs to check all managed entities for changes every time you invoke EntityManager#flush(), making this operation rather costly. This is the default behavoir, called the DEFERRED IMPLICIT tracking policy. This works out of the box; however, you might want to tweak the flush performance. You can do this using the @ORMChangeTrackingPolicy annotation.

By default Doctrine checks each entity is checked according to the deferred implicit strategy, and upon flush UnitOfWork compares all the properties of an entity to a previously stored snapshot.

The deferred explicit policy is similar to the deferred implicit policy, in that changes are detected through a property-by-property comparison at commit time. However, entities marked with the DEFERRED_EXPLICIT tracking policy must first explicitly call EntityManager#persist (or be part of a save cascade); otherwise, they will be skipped, and their changes will not be persisted during flush.

In the NOTIFY tracking policy entities notify interested listeners of changes to their properties. See 15.3 for details.

Partial Objects

Not yet done

Lifecycle Callbacks

You can register lifecycle callbacks to notify you entity of the following events:

preRemove
postRemove
prePersist
postPersist
preUpdate
postUpdate
preLoad
postLoad
To register your entity to use lifecycle callbacks, add the @HasLifeCycleCallBacks annotation. To register a particular callback, add the appropriate callback lifecycle event annotation: @PostLoad, @PrePersist, @PostPersist, @PreRemove, @PostRemove, @PreUpdate or @PostUpdate:

setCreated(new \DateTime());
        $this->setUpdated(new \DateTime());
    }

     /**
     * @ORM\preUpdate
     */
    public function setUpdatedValue()
    {
       $this->setUpdated(new \DateTime());
    }
}
Notes from Jonathan Wage’s Webinar

See this pdf from Jonathan Wages presentation.

Iterating over queries directly

TODO: How does iterate() save memory? Does it hit the DB each time it is called. Does it perfourm like a result set?

You can use foreach to iterate over object associations directly (elaborate on this)

execute();

foreach ($users as $user) {
      foreach ($users->getGroups() as $group) {

      }
}
or use can use the Query::iterate() method

iterate()  as $user) {
      foreach ($users->getGroups() as $group) {

      }
}
Note: Iterate() will only hydrate on object as at a time rather than hydrate all objects in one fell swoop (test this). Prefer Query::iterate over Query::execute followed by foreach(), to keep your memory footprint low.

Best Practices

Improving Performance (best practices)

It is highly recommended to make use of a bytecode cache like APC. A bytecode cache removes the need for parsing PHP code on every request and can greatly improve performance.

Use Transaction Demarcation (best practices)

While Doctrine will automatically wrap all DQL operations in a transaction on flush(), it is considered best practice to explicitly set the transaction boundaries yourself; otherwise, every single query is wrapped in a small transaction—Yes, SELECT queries, too—since you can not talk to your database outside of a transaction. While such short transactions for read-only (SELECT) queries generally don’t have any noticeable performance impact, it is still preferable to use fewer, well-defined transactions that are established through explicit transaction boundaries.

TODO: provide some examples
